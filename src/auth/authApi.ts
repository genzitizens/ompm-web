import type {
  AuthResponse,
  LoginTempAccountRequest,
  RegisterTempAccountRequest
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type RequestOptions = {
  method: "POST";
  path: string;
  body: unknown;
};

async function request<T>({ method, path, body }: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Request failed");
  }

  return (await response.json()) as T;
}

export function register(payload: RegisterTempAccountRequest) {
  return request<AuthResponse>({
    method: "POST",
    path: "/api/v1/auth/register",
    body: payload
  });
}

export function login(payload: LoginTempAccountRequest) {
  return request<AuthResponse>({
    method: "POST",
    path: "/api/v1/auth/login",
    body: payload
  });
}
