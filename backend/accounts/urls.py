from django.urls import path, include
from .views import CustomTokenObtainPairView, CustomTokenRefreshView

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    # маршруты для dj-rest-auth (в том числе для регистрации через Google OAuth, если настроено)
    #path('dj-rest-auth/', include('dj_rest_auth.urls')),
    #path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
