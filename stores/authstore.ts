import { create } from "zustand";

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
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
