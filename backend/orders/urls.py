from django.urls import path
from .views import (
    CreateOrderView,
    LiqPayCallbackView,
    LiqPayInitView,
    PaymentSuccessView,
    UserOrdersView,
)

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('my-orders/', UserOrdersView.as_view(), name='user-orders'),
    path('liqpay-init/<int:order_id>/', LiqPayInitView.as_view(), name='liqpay-init'),
    path('liqpay-callback/', LiqPayCallbackView.as_view(), name='liqpay-callback'),
    path('<int:order_id>/', PaymentSuccessView.as_view(),  name='order-verify'),
]
