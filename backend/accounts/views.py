from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from .sendEmail import send_confirmation_email, verify_confirmation_token
from django.shortcuts import get_object_or_404
from .models import AppUser 


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_confirmation_email(user)
            return Response({"message": "Пользователь успешно зарегистрирован. Проверьте почту для подтверждения."},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ConfirmEmailView(APIView):
    def get(self, request, token):
        email = verify_confirmation_token(token)
        if not email:
            return Response({"error": "Неверный или просроченный токен."}, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(AppUser, email=email)
        user.is_verified = True
        user.save()
        return Response({"message": "Email успешно подтвержден."})



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
