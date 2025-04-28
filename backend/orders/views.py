import json
import base64
from django.conf import settings
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from rest_framework.permissions import IsAuthenticated
from .serializers import OrderCreateSerializer, OrderSerializer
from .payment import generate_liqpay_data, generate_liqpay_signature
from products.models import Product
from accounts.authentication import CookieJWTAuthentication

import logging
logger = logging.getLogger(__name__)


class UserOrdersView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes     = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
                 .filter(email=request.user.email)
                 .order_by('-created_at')
                 .prefetch_related('items')  # грузим позиции заказов одной выборкой
        )
        # Собираем product_id всех позиций
        product_ids = {item.product_id for order in orders for item in order.items.all()}
        products    = Product.objects.filter(id__in=product_ids)
        product_map = {p.id: p for p in products}

        serializer = OrderSerializer(
            orders,
            many=True,
            context={'product_map': product_map}  # передаём map в сериализатор
        )
        return Response(serializer.data)


class CreateOrderView(APIView):
    """
    1) Всегда создаём заказ (для cash — сразу окончательный, для card — в статусе pending).
    2) Возвращаем полную сериализованную модель с id.
    """
    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data,
                                           context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        if order.payment_type == 'cash':
            # наличными: можно сразу очистить корзину
            request.session.pop('cart', None)
            # статус остаётся new — считаем его предоплаченным при получении
        else:
            # картой: помечаем как ожидающий оплату
            order.status = 'pending'
            order.save()

        # возвращаем полный объект с id
        out_ser = OrderSerializer(order)
        return Response(out_ser.data, status=status.HTTP_201_CREATED)
    

class LiqPayInitView(APIView):
    """
    Frontend calls this *after* receiving {"detail":"ready_for_payment"}.
    We now create the Order and return LiqPay payload.
    """
    def get(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        data      = generate_liqpay_data(order)
        signature = generate_liqpay_signature(data)
        return Response({"data": data, "signature": signature})
    

@method_decorator(csrf_exempt, name="dispatch")
class LiqPayCallbackView(APIView):
    def post(self, request):
        data      = request.data.get("data")
        signature = request.data.get("signature")
        # проверяем подпись
        if generate_liqpay_signature(data) != signature:
            return HttpResponseBadRequest("Invalid signature")
        # декодируем и логируем payload
        payload = json.loads(base64.b64decode(data).decode())
        logger.info("LiqPay payload: %s", payload)

        order = get_object_or_404(Order, pk=payload["order_id"])
        # учитываем песочницу
        if payload.get("status") in ("success", "sandbox"):
            order.status            = "completed"
            order.card_mask         = payload.get("masked_card")
            order.card_type         = payload.get("card_type")
            order.liqpay_payment_id = payload.get("payment_id")
            order.payment_date      = timezone.now()
            order.save()
            try:
                del request.session["cart"]
            except KeyError:
                pass

        return HttpResponse("all good")




class PaymentSuccessView(APIView):
    """
    Подтверждение успешного платежа.
    GET /api/orders/payment-success/<order_id>/?token=<token>
    """
    def get(self, request, order_id):
        token = request.GET.get('token')
        order = get_object_or_404(
            Order,
            pk=order_id,
            success_token=token,
            is_token_used=False,
        )

        # Проверяем срок действия токена
        if order.token_expiration < timezone.now():
            return redirect(settings.FRONTEND_URL + '/payment-error?reason=token-expired')

        # Помечаем токен использованным
        order.is_token_used = True
        order.save()

        # Очищаем корзину
        request.session.pop('cart', None)

        # Собираем список позиций с картинками
        items_data = []
        for item in order.items.all():
            # Пытаемся достать объект Product, чтобы получить его изображение
            try:
                product = Product.objects.get(pk=item.product_id)
                image_url = request.build_absolute_uri(product.image_url)
            except (Product.DoesNotExist, ValueError, AttributeError):
                image_url = None

            items_data.append({
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "variant_id": item.variant_id,
                "variant_price": str(item.variant_price),
                "extras": item.extras,
                "quantity": item.quantity,
                "subtotal": str(item.subtotal),
                "image": image_url,
            })

        return Response({
            "status":        "success",
            "order_id":      order.id,
            "amount":        float(order.final_total),
            "delivery_fee":  float(order.delivery_fee),
            "tax_amount":    float(order.tax_amount),
            "payment_date":  order.payment_date,
            "items":         items_data,
        }, status=200)