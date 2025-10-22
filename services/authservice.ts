import api from "@/lib/api";
import type { SignupFormData, LoginFormData } from "@/schemas/authschema";

export const Signup = async (payload: SignupFormData) => {
  const response = await api.post("/auth/register", payload);

  return response.data;
};

export const login = async (payload: LoginFormData) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const profile = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
