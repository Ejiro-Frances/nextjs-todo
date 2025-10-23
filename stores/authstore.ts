import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
