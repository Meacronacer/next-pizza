from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    ConfirmEmailView,
    RegisterView,
    get_profile,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    GoogleLoginView,
    logout_view,
)

urlpatterns = [
    path('me/', get_profile, name='get_profile'),
    path('google/', GoogleLoginView.as_view(), name='google-login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('logout/', logout_view, name='logout'),
]
