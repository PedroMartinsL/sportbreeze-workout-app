// src/store/auth.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

interface JwtPayload {
  sub: string;
  role: string;
}

// STORAGE ADAPTER (Mobile → SecureStore | Web → localStorage) ---
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") return localStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },

  deleteItem: async (key: string) => {
    if (Platform.OS === "web") return localStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  }
};


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

  login: async (email, password) => {
    const res = await apiFetch({
      path: "/auth/login",
      method: "POST",
      body: { email, password },
      onUnauthorized: get().refreshSession,
      onLogout: get().logout,
    });

    const { access_token, refresh_token } = res;
    const decoded = jwtDecode<JwtPayload>(access_token);

    await storage.setItem("refresh_token", refresh_token);

    set({
      accessToken: access_token,
      user: Number(decoded.sub),
      role: decoded.role,
    });
  },

  refreshSession: async (): Promise<string | null> => {
    const refreshToken = await storage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
      const res = await apiFetch({
        path: "/auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
        token: null,
        onUnauthorized: async () => null,
        onLogout: get().logout,
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

  logout: async () => {
    await storage.deleteItem("refresh_token");
    set({ user: null, accessToken: null, role: "" });
  },

  initAuth: async () => {
    const refreshToken = await storage.getItem("refresh_token");
    if (!refreshToken) {
      set({ loading: false });
      return;
    }

    try {
      const res = await apiFetch({
        path: "/auth/refresh",
        method: "POST",
        body: {},
        token: refreshToken,
        onUnauthorized: async () => null,
        onLogout: get().logout,
      });

      const { access_token } = res;
      const decoded = jwtDecode<JwtPayload>(access_token);

      set({
        accessToken: access_token,
        user: Number(decoded.sub),
        role: decoded.role,
        loading: false,
      });
    } catch {
      await get().logout();
      set({ loading: false });
    }
  },
}));
