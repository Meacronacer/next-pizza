from .models import AppUser
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AppUser
        fields = ('first_name', 'second_name', 'email', 'password')

    def create(self, validated_data):
        user = AppUser.objects.create_user(**validated_data)
        # Если нужна отправка письма для подтверждения, генерируем токен и отправляем письмо здесь
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user is associated with this email address.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            self.user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid UID.")

        token_ok = PasswordResetTokenGenerator().check_token(self.user, data['token'])
        if not token_ok:
            raise serializers.ValidationError("Token is invalid or has expired.")
        return data

class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

class VerifiedTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # self.user теперь — аутентифицированный пользователь
        if not self.user.is_verified:
            # можно также отправить новый письменно заявку на верификацию
            raise serializers.ValidationError({
                'detail': "Please verify your account via email. A verification link email was sent earlier."
            }, code='unverified')
        return data