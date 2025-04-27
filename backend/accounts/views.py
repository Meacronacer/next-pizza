from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from .serializers import (
    RegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    GoogleAuthSerializer,
    VerifiedTokenObtainPairSerializer
)
from .confirmEmail import send_confirmation_email, verify_confirmation_token
from .models import AppUser 
from .authentication import CookieJWTAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
import requests

User = get_user_model()

@api_view(['GET'])
@authentication_classes([CookieJWTAuthentication])
@permission_classes([AllowAny])
def get_profile(request):
    # Попытка извлечь токен из cookies; имя ключа можно задать по своему усмотрению
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"detail": "Access token not provided in cookies."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Проверяем токен на валидность
        access_token = AccessToken(token)
    except TokenError as e:
        return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Извлечение id пользователя из токена (стандартное поле SimpleJWT - user_id)
    user_id = access_token.get("user_id")
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
    profile_data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "second_name": user.second_name,
        "img_url": user.img_url
    }
    return Response(profile_data)


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
        return redirect(settings.FRONTEND_URL + '/login/')
    

class GoogleLoginView(APIView):
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']

        # Валидация токена через Google
        try:
            response = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                params={"access_token": token},
                timeout=5
            )
            response.raise_for_status()
            user_data = response.json()
        except requests.RequestException:
            return Response(
                {'error': 'Invalid Google token'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = user_data.get('email')
        if not email:
            return Response(
                {'error': 'Email not found in token'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Поиск или создание пользователя
        try:
            user = AppUser.objects.get(email=email)
            if user.provider != 'google':
                return Response(
                    {'error': 'User exists with different auth method'},
                    status=status.HTTP_409_CONFLICT
                )
        except AppUser.DoesNotExist:
            user = AppUser.objects.create_user(
                email=email,
                first_name=user_data.get('given_name', ''),
                second_name=user_data.get('family_name', ''),
                img_url=user_data.get('picture', ''),
                provider='google'
            )

        # Генерация JWT токенов
        refresh = RefreshToken.for_user(user)
        response = Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })

        # Установка токенов в cookies
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=True,            # обязательно для SameSite=None
            samesite='None',          # разрешить кросс‑доменную отправку
            max_age=60 * 60 * 24 * 7,

        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,            # обязательно для SameSite=None
            samesite='None',          # разрешить кросс‑доменную отправку
            max_age=60 * 60 * 24 * 7,

        )

        del response.data['access']
        del response.data['refresh']
        
        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = VerifiedTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            response.set_cookie(
                key='access_token',
                value=response.data['access'],
                httponly=True,
                secure=True,            # обязательно для SameSite=None
                max_age=60 * 60 * 24 * 7,
                samesite='None',          # разрешить кросс‑доменную отправку

            )
            response.set_cookie(
                key='refresh_token',
                value=response.data['refresh'],
                httponly=True,
                secure=True,            # обязательно для SameSite=None
                max_age=60 * 60 * 24 * 7,  # 7 дней
                samesite='None',          # разрешить кросс‑доменную отправку

            )
            
            # Убираем токены из тела ответа
            del response.data['access']
            del response.data['refresh']
        
        return response
    

class CustomTokenRefreshView(TokenRefreshView):
    """
    При обновлении access-токена, возвращает новый access-токен и устанавливает его в куки.
    Если refresh-токен не передан в теле запроса, он берется из куки 'refresh_token'.
    """
    def post(self, request, *args, **kwargs):
        # Если в теле запроса не передан refresh-токен, достаем его из куки
        if "refresh" not in request.data:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                # Если request.data — QueryDict, его нужно сделать мутабельным
                if hasattr(request.data, 'copy'):
                    data_copy = request.data.copy()
                    data_copy["refresh"] = refresh_token
                    request._full_data = data_copy
                else:
                    request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            response.set_cookie(
                key='access_token',
                value=data.get('access'),
                httponly=True,
                secure=True,            # обязательно для SameSite=None
                samesite='None',          # разрешить кросс‑доменную отправку
                max_age=60 * 60 * 24 * 7,

            )

            del response.data['access']

        return response



class PasswordResetRequestView(APIView):
    """
    POST { "email": "user@example.com" }
    """
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        # Build password reset link
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password-confirm/{uidb64}/{token}/"

        # Send email
        subject = "Password Reset Requested"
        message = (
            f"Hi {user.first_name},\n\n"
            f"To reset your password, click the link below:\n\n"
            f"{reset_url}\n\n"
            "If you did not request a password reset, please ignore this email.\n"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        return Response({"message": "Password reset link was sent to your email!"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """
    POST { "uid": "...", "token": "...", "new_password": "..." }
    """
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)


@api_view(['POST'])
def logout_view(request):
    """
    Очищает куки access_token и refresh_token для логаута.
    """
    response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
    # Удаляем токены
    response.delete_cookie(
        key='access_token',
        #domain='.your-backend-domain.com',
        path='/',
        secure=True,
        samesite='None'
    )
    response.delete_cookie(
        key='refresh_token',
        #domain='.your-backend-domain.com',
        path='/',
        secure=True,
        samesite='None'
    )
    return response

