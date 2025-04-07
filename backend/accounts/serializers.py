from rest_framework import serializers
from .models import AppUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AppUser
        fields = ('email', 'password')

    def create(self, validated_data):
        user = AppUser.objects.create_user(**validated_data)
        # Если нужна отправка письма для подтверждения, генерируем токен и отправляем письмо здесь
        return user
