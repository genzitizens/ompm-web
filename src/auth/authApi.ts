import { request } from "../api/http";
import type { AuthResponse, LoginTempAccountRequest, RegisterTempAccountRequest } from "./types";

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
