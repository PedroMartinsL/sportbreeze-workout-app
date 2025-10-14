import { create } from "zustand";

type TokenStore = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  login: (access_token: string, refresh_token: string, token_type: string) => void;
};

export const useStore = create<TokenStore>()((set) => ({
  access_token: "",
  refresh_token: "",
  token_type: "",

  login: (access_token, refresh_token, token_type) =>
    set(() => ({
      access_token,
      refresh_token,
      token_type,
    })),
}));