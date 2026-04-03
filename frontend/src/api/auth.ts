import type { LoginRequest, TokenResponse, User } from "../types/auth";
import { apiFetch, setToken, removeToken } from "./client";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  if (!response.ok) {
    throw new Error(`Błąd serwera: ${response.status}`);
  }

  const result = (await response.json()) as TokenResponse;
  setToken(result.access_token);
  return result;
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

export function logout(): void {
  removeToken();
}
