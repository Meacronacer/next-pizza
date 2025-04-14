import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Проверяем, если путь соответствует логину или регистрации
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    // Получаем access_token из куки
    const accessToken = request.cookies.get("access_token")?.value;

    // Если токен есть, считаем, что пользователь авторизован, и перенаправляем
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/register/:path*"],
};
