# views.py
import json
from django.views import View
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from products.models import ProductVariant

class GetCartView(View):
    def get(self, request):
        cart = request.session.get("cart", {})
        cart_details = []

        # Получаем id всех вариантов, чтобы затем запросить их из БД
        variant_ids = cart.keys()
        variants = ProductVariant.objects.filter(id__in=variant_ids)

        for variant in variants:
            item = cart.get(str(variant.id), {})
            cart_details.append({
                "product_variant_id": variant.id,
                "product_id": variant.product.id,
                "product_name": variant.product.name,
                "quantity": item.get("quantity", 0),
                "price": float(variant.price),  # актуальная цена из БД
                "subtotal": float(variant.price) * item.get("quantity", 0)
            })

        return JsonResponse({"cart": cart_details})


@method_decorator(csrf_exempt, name='dispatch')
class AddToCartView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            product_variant_id = str(data.get("product_variant_id"))
            quantity = int(data.get("quantity", 1))
        except Exception:
            return HttpResponseBadRequest("Invalid input")

        # Проверяем существование варианта товара
        try:
            variant = ProductVariant.objects.get(id=product_variant_id)
        except ProductVariant.DoesNotExist:
            return HttpResponseNotFound("Product variant not found")

        # Получаем корзину из сессии или инициализируем пустой словарь
        cart = request.session.get("cart", {})

        if product_variant_id in cart:
            cart[product_variant_id]["quantity"] += quantity
        else:
            cart[product_variant_id] = {"quantity": quantity}

        request.session["cart"] = cart  # Сохраняем обновлённую корзину
        request.session.modified = True

        return JsonResponse({"message": "Added to cart", "cart": cart})


@method_decorator(csrf_exempt, name='dispatch')
class UpdateCartItemView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            product_variant_id = str(data.get("product_variant_id"))
            quantity = int(data.get("quantity", 1))
        except Exception:
            return HttpResponseBadRequest("Invalid input")

        cart = request.session.get("cart", {})

        if product_variant_id in cart:
            # Если количество равно 0, можно удалить товар
            if quantity <= 0:
                del cart[product_variant_id]
            else:
                cart[product_variant_id]["quantity"] = quantity
            request.session["cart"] = cart
            request.session.modified = True
            return JsonResponse({"message": "Cart updated", "cart": cart})
        else:
            return HttpResponseNotFound("Cart item not found")


@method_decorator(csrf_exempt, name='dispatch')
class RemoveFromCartView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            product_variant_id = str(data.get("product_variant_id"))
        except Exception:
            return HttpResponseBadRequest("Invalid input")

        cart = request.session.get("cart", {})

        if product_variant_id in cart:
            del cart[product_variant_id]
            request.session["cart"] = cart
            request.session.modified = True
            return JsonResponse({"message": "Item removed", "cart": cart})
        else:
            return HttpResponseNotFound("Cart item not found")
