from django.urls import path
from .views import ProductListView, ProductDetailView, ProductFlatListView


urlpatterns = [
    path('get-all/', ProductListView.as_view(), name='product-list'),
    path('all-products/', ProductFlatListView.as_view(), name='product-flat-list'),
    # Новый URL-эндпоинт для получения деталей конкретного продукта по его id
    path('get-product/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
