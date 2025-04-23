# accounts/authentication.py
from django.conf              import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.middleware.csrf   import CsrfViewMiddleware
from django.http              import HttpResponse
from rest_framework           import exceptions

def enforce_csrf(request):
    # инициализируем CsrfViewMiddleware с заглушкой get_response
    csrf_mw = CsrfViewMiddleware(get_response=lambda req: HttpResponse())
    reason = csrf_mw.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        enforce_csrf(request)  # CSRF‑проверка только для «небезопасных» запросов
        return self.get_user(validated_token), validated_token
