from django.urls import path
from .views import ProductListView, ProductDetailView

urlpatterns = [
    path('get-all/', ProductListView.as_view(), name='product-list'),
    # Новый URL-эндпоинт для получения деталей конкретного продукта по его id
    path('get-product/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
