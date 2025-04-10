from django.urls import path
from .views import add_to_cart, get_cart, update_cart_item_quantity, remove_cart_item, edit_cart_item

urlpatterns = [
    path('add/', add_to_cart, name='cart-add'),
    path('update/', update_cart_item_quantity, name='cart-update'),
    path('edit/', edit_cart_item, name='cart-edit'),
    path('remove/', remove_cart_item, name='cart-remove'),
    path('', get_cart, name='cart-detail'),
]
