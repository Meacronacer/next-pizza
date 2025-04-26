from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.crypto import get_random_string


class AppUserManager(BaseUserManager):
    def create_user(self, email, first_name, second_name, img_url='', provider='email', password=None):
        if not email:
            raise ValueError("An email is required.")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            second_name=second_name,
            img_url=img_url
        )
        user.provider = provider
        
        if provider == 'google':
            user.is_verified = True
            if not password:
                # generate a secure random password of length 12
                password = get_random_string(12)
                
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, first_name, second_name, img_url, password=None):
        user = self.create_user(
            email=self.normalize_email(email),
            first_name=first_name,
            second_name=second_name,
            password=password,
            img_url=img_url
        )
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.is_verified = True
        user.save(using=self._db)
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    img_url = models.URLField(max_length=300, blank=True)
    provider = models.CharField(max_length=50, default='email')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'second_name', 'img_url']
    objects = AppUserManager()

    def __str__(self) -> str:
        return self.email
