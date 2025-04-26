export const API_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<boolean> | null = null;

export async function customFetch(
  input: RequestInfo,
  init: RequestInit = {},
  retry: boolean = true
): Promise<Response> {
  // 1) Make the request
  const response = await fetch(input, { credentials: "include", ...init });

  // 2) If 401 and we're allowed to retry
  if (response.status === 401 && retry) {
    // 2a) If no one else is refreshing, start the refresh
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshRes = await fetch(`${API_URL}/api/auth/token/refresh/`, {
          method: "POST",
          credentials: "include",
        });
        if (!refreshRes.ok) {
          // If refresh fails, log out & redirect
          await fetch(`${API_URL}/api/auth/logout/`, {
            method: "POST",
            credentials: "include",
          });
          //window.location.href = LinkTo.login;
          return false;
        }
        return true;
      })();
    }

    // 2b) Wait for that shared refresh to complete
    const ok = await refreshPromise;
    refreshPromise = null; // reset for future 401s

    // 2c) If refresh succeeded, retry original request once
    if (ok) {
      return customFetch(input, init, /* retry= */ false);
    } else {
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
      // И перенаправляем пользователя на страницу логина
      // window.location.href = LinkTo.login;
    }
    // else: refresh already handled logout/redirect
  }

  return response;
}
