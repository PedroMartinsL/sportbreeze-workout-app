// src/services/api.ts
const BASE_URL = process.env.EXPO_PUBLIC_IP_FETCH; // backend FastAPI

console.log(BASE_URL)

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiFetchOptions {
  path: string;
  method?: HttpMethod;
  body?: any;
  token?: string | null;
  // callbacks opcionais para refresh e logout
  onUnauthorized?: () => Promise<string | null>;
  onLogout?: () => Promise<void>;
}

export async function apiFetch({
  path,
  method = "GET",
  body = null,
  token = null,
  onUnauthorized,
  onLogout,
}: ApiFetchOptions): Promise<any> {

  const makeRequest = async (tokenToUse: string | null) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (tokenToUse) headers["Authorization"] = `Bearer ${tokenToUse}`;

    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return response;
  };

  let tokenToUse = token;
  let response = await makeRequest(tokenToUse);

  // Se 401 e callbacks definidos, tenta refresh
  if (response.status === 401 && onUnauthorized) {
    const newToken = await onUnauthorized();
    if (newToken) {
      tokenToUse = newToken;
      response = await makeRequest(tokenToUse);
    } else {
      await onLogout?.();
      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro ${response.status}: ${errorData}`);
  }

  return response.json();
}
