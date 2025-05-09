import {
  IloginForm,
  ILoginResponse,
  ImessageResponse,
  IregisterForm,
  IresetPasswordConfirm,
} from "@/@types/auth";
import { API_URL, customFetch } from "./base";

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
  payload: IregisterForm
): Promise<ImessageResponse> {
  const res = await fetch(API_URL + "/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData?.detail || errorData?.error || "Registration failed"
    );
  }
  return res.json();
}

export async function loginUser(payload: IloginForm): Promise<ILoginResponse> {
  const res = await fetch(API_URL + "/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include", // Если вы хотите передавать куки
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.detail || errorData?.error || "Login failed");
  }
  return res.json();
}

export async function loginUserWithGoogle(token: string) {
  const res = await fetch(API_URL + "/api/auth/google/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Если вы хотите передавать куки
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.detail || errorData?.error || "Login failed");
  }

  return res.json();
}

export async function requestPasswordReset(payload: {
  email: string;
}): Promise<ImessageResponse> {
  const res = await fetch(API_URL + "/api/auth/password-reset/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData?.email ||
        errorData?.detail ||
        errorData?.error ||
        "Password reset request failed"
    );
  }
  return res.json();
}

export async function confirmPasswordReset(
  payload: IresetPasswordConfirm
): Promise<ImessageResponse> {
  const res = await fetch(API_URL + "/api/auth/password-reset-confirm/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return errorData;
  }
  return res.json();
}

export async function logout({}) {
  const res = await fetch(API_URL + "/api/auth/logout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Если вы хотите передавать куки
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.detail || errorData.error || "Login failed");
  }
  return res.json();
}
