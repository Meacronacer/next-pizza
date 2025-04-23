import { LinkTo } from "@/utils/navigations";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Функция-обёртка для fetch, которая при 401 пытается обновить токен,
// а если обновление не удалось, выполняет логаут (вызов logout-endpoint) и перенаправляет на страницу логина.
export async function customFetch(
  input: RequestInfo,
  init: RequestInit = {},
  retry: boolean = true
): Promise<Response> {
  let response = await fetch(input, init);

  if (response.status === 401 && retry) {
    // Попытка обновить access-токен через refresh-endpoint
    const refreshResponse = await fetch(`${API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      credentials: "include", // чтобы куки передавались
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    if (refreshResponse.ok) {
      // Если обновление прошло успешно, повторяем исходный запрос (без повторного обновления)
      response = await customFetch(input, init, false);
    } else {
      // Если обновление токена не удалось, вызываем logout-endpoint для очистки куки на сервере
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
      // И перенаправляем пользователя на страницу логина
      // window.location.href = LinkTo.login;
      // throw new Error("Session expired. Logged out.");
    }
  }

  return response;
}
