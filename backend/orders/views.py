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
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.sessions.models import Session

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

        if order.payment_type == 'card':
            # гарантированно сохраняем сессию, чтобы сгенерировать ключ
            if not request.session.session_key:
                request.session.create()

            # теперь session_key точно существует
            order.session_key = request.session.session_key
            order.status = 'pending'
        else:
            # оплата наличными — можно сразу очистить корзину
            request.session.pop('cart', None)
            
        
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

            logger.info("before session check")
            # Если у заказа есть session_key — удаляем запись из django_session
            if order.session_key:
                deleted, _ = Session.objects.filter(
                    session_key=order.session_key
                ).delete()
                logger.info(
                    "После оплаты LiqPay удалено %d сессий с ключом %s",
                    deleted,
                    order.session_key
                )
            logger.info("after session check")

        return HttpResponse("all good")




class PaymentSuccessView(APIView):
    """
    Подтверждение успешного платежа.
    """
    def get(self, request, token):
        order = get_object_or_404(Order, success_token=token)

        # Проверяем срок действия токена
        if order.token_expiration < timezone.now():
            return redirect(settings.FRONTEND_URL + '/payment-error?reason=token-expired')

        # Помечаем токен использованным
           # Если ещё не отмечен — помечаем
        if not order.is_token_used:
            order.is_token_used = True
            order.save()

        # Собираем список позиций с картинками
        items_data = []
        for item in order.items.all():
            # Пытаемся достать объект Product, чтобы получить его изображение
            try:
                product = Product.objects.get(pk=item.product_id)
                img_url = request.build_absolute_uri(product.img_url)
            except (Product.DoesNotExist, ValueError, AttributeError):
                img_url = None

            items_data.append({
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "variant_id": item.variant_id,
                "variant_price": str(item.variant_price),
                "extras": item.extras,
                "quantity": item.quantity,
                "subtotal": str(item.subtotal),
                "img_url": img_url,
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