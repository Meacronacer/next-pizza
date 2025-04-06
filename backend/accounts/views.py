from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    При успешной аутентификации возвращает access и refresh токены,
    устанавливая их в HttpOnly cookies.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            # Устанавливаем access-токен в куки (HttpOnly, samesite можно настроить)
            response.set_cookie(
                key='access_token',
                value=data.get('access'),
                httponly=True,
                secure=False,  # установите True на production с HTTPS
                max_age=300,   # 5 минут в секундах (должно совпадать с ACCESS_TOKEN_LIFETIME)
                samesite='Lax'
            )
            # Устанавливаем refresh-токен в куки
            response.set_cookie(
                key='refresh_token',
                value=data.get('refresh'),
                httponly=True,
                secure=False,
                max_age=15 * 24 * 60 * 60,  # 15 дней
                samesite='Lax'
            )
        return response

class CustomTokenRefreshView(TokenRefreshView):
    """
    При обновлении access-токена, возвращает новый access-токен и устанавливает его в куки.
    Refresh-токен не меняется, благодаря настройке ROTATE_REFRESH_TOKENS=False.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            response.set_cookie(
                key='access_token',
                value=data.get('access'),
                httponly=True,
                secure=False,
                max_age=300,  # 5 минут
                samesite='Lax'
            )
        return response
