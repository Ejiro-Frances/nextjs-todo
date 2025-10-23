import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/authstore";

// Shape of the refresh response
interface RefreshResponse {
  accessToken: string;
}

// Type for queued requests waiting for refresh
interface FailedRequest {
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
}

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// --- REFRESH TOKEN HANDLER ---
const refresh = async (
  accessToken: string,
  refreshToken: string
): Promise<RefreshResponse> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  const response = await axios.post(
    `${baseURL}/auth/refresh`,
    { refreshToken }, // body
    {
      headers: {
        "Content-Type": "application/json",
        AccessToken: accessToken, // custom header
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// --- ATTACH ACCESS TOKEN TO REQUESTS ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    // backend expects AccessToken header, not Authorization
    config.headers.AccessToken = accessToken;
  }
  return config;
});

// ---QUEUE FAILED REQUESTS WHILE REFRESHING---
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || "");
    }
  });

  failedQueue = [];
};

// ---RESPONSE INTERCEPTOR TO HANDLE 401 ERRORS---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const store = useAuthStore.getState();
      const { accessToken, refreshToken } = store;

      if (!refreshToken) {
        store.logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue all failed requests until refresh is done
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = token;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refresh(accessToken || "", refreshToken); // call refresh endpoint

        const newAccessToken = data.accessToken;
        const store = useAuthStore.getState();
        store.setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default api;
