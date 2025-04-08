from django.urls import path
from .views import AddToCartView, UpdateCartItemView, RemoveFromCartView, GetCartView

urlpatterns = [
    path('add/', AddToCartView.as_view(), name='cart-add'),
    path('update/', UpdateCartItemView.as_view(), name='cart-update'),
    path('remove/', RemoveFromCartView.as_view(), name='cart-remove'),
    path('', GetCartView.as_view(), name='cart-detail'),
]
