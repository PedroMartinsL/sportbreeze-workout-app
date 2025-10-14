// api.js
const BASE_URL = "http://192.168.1.36:8000"; // backend FastAPI

export async function apiFetch(path, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro ${response.status}: ${errorData}`);
  }

  return response.json();
}
