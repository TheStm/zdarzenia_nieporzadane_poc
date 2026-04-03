export type Role = "reporter" | "coordinator" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  reporter: "Zgłaszający",
  coordinator: "Koordynator",
  admin: "Administrator",
};
