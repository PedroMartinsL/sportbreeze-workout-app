// src/services/api.ts
import { useAuthStore } from "../store/auth";

const BASE_URL = "http://192.168.1.36:8000"; // backend FastAPI

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiFetchOptions {
  path: string;
  method?: HttpMethod;
  body?: any;
  token?: string | null;
}

export async function apiFetch({
  path,
  method = "GET",
  body = null,
  token = null,
}: ApiFetchOptions): Promise<any> {
  const { accessToken, refreshSession, logout } = useAuthStore.getState();

  // Função interna para fazer a requisição
  async function makeRequest(tokenToUse: string | null) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (tokenToUse) headers["Authorization"] = `Bearer ${tokenToUse}`;

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    return response;
  }

  // Se o token foi passado manualmente, usa ele; senão usa da store
  const tokenToUse = token || accessToken;
  let response = await makeRequest(tokenToUse);

  // Se deu 401 e não estamos usando token manual, tenta refresh
  if (response.status === 401 && !token) {
    try {
      const newAccessToken = await refreshSession();
      if (newAccessToken) {
        response = await makeRequest(newAccessToken); // refaz a requisição
      } else {
        await logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    } catch (err) {
        console.log(err)
      await logout();
      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro ${response.status}: ${errorData}`);
  }

  return response.json();
}
