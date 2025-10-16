// src/store/auth.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "@/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  loading: true,

  // Login do usuário
  login: async (email: string, password: string) => {
    const res = await apiFetch({
      path: "auth/login",
      method: "POST",
      body: { email, password },
    });

    const { access_token, refresh_token, user } = res;

    await SecureStore.setItemAsync("refresh_token", refresh_token);
    set({ accessToken: access_token, user });
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

      const { access_token, user } = res;
      set({ accessToken: access_token, user });
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

      const { access_token, user } = res;
      set({ accessToken: access_token, user, loading: false });
    } catch {
      await get().logout();
      set({ loading: false });
    }
  },
}));
