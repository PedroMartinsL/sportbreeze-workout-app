// src/store/auth.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "@/services/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
}

interface AuthState {
  user: number | null;
  accessToken: string | null;
  loading: boolean;
  role: string;

  login: (email: string, password: string) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  loading: true,
  role: "",

  // Login do usuário
  login: async (email: string, password: string) => {
    const res = await apiFetch({
      path: "auth/login",
      method: "POST",
      body: { email, password },
    });

    const { access_token, refresh_token } = res;
    const decoded = jwtDecode<JwtPayload>(access_token);
    const userId = decoded.sub;
    const role = decoded.role;

    await SecureStore.setItemAsync("refresh_token", refresh_token);
    set({ accessToken: access_token, user: Number(userId), role: role});
  },

  // Renova o access token usando o refresh token
  refreshSession: async (): Promise<string | null> => {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    if (!refreshToken) return null;

    try {
      const res = await apiFetch({
        path: "auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      });

      const { access_token } = res;
      const decoded = jwtDecode<JwtPayload>(access_token);

      set({
        accessToken: access_token,
        user: Number(decoded.sub),
        role: decoded.role,
      });
      return access_token;
    } catch {
      await get().logout();
      return null;
    }
  },

  // Logout
  logout: async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    set({ user: null, accessToken: null });
  },

  // Inicializa a sessão ao abrir o app
  initAuth: async () => {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    if (!refreshToken) {
      set({ loading: false });
      return;
    }

    try {
      const res = await apiFetch({
        path: "auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      });

      const { access_token } = res;
      const decoded = jwtDecode<JwtPayload>(access_token);

      set({
        accessToken: access_token,
        user: Number(decoded.sub),
        role: decoded.role,
        loading: false
      });
    } catch {
      await get().logout();
      set({ loading: false });
    }
  },
}));
