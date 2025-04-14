import { API_URL, customFetch } from "./base";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  // Добавьте дополнительные поля, если нужно
}

export interface RegisterResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export async function fetchUserProfile() {
  const res = await customFetch(`${API_URL}/api/auth/me/`, {
    method: "GET",
    credentials: "include", // чтобы куки отправлялись
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Error fetching user profile");
  }
  return res.json();
}

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await fetch(API_URL + "/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Registration failed");
  }
  return res.json();
}

export async function loginUser(payload: LoginPayload) {
  const res = await fetch(API_URL + "/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include", // Если вы хотите передавать куки
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Login failed");
  }
  return res.json();
}

export async function requestPasswordReset(payload: {
  email: string;
}): Promise<{ message: string }> {
  const res = await fetch(API_URL + "/api/auth/password-reset-request/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Password reset request failed");
  }
  return res.json();
}
