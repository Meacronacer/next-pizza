from django.urls import path
from .views import (
    add_to_cart,
    get_cart,
    update_cart_item_quantity,
    clear_cart,
    edit_cart_item
)

urlpatterns = [
    path('add/', add_to_cart, name='cart-add'),
    path('update/', update_cart_item_quantity, name='cart-update'),
    path('edit/', edit_cart_item, name='cart-edit'),
    path('clear/', clear_cart, name='cart-remove'),
    path('', get_cart, name='cart-detail'),
]
