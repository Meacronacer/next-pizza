from rest_framework import serializers
from .models import Order, OrderItem
from decimal import Decimal, ROUND_HALF_UP
from products.serializers import ProductSerializerCrop


class OrderItemSerializer(serializers.ModelSerializer):
    product_data = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id", "product_id", "product_name", "variant_id", "variant_price",
            "extras", "quantity", "subtotal", 'product_data',
        ]
        read_only_fields = ("subtotal",)

    def get_product_data(self, obj):
        # безопасно берем map, если его нет — возвращаем None
        product_map = self.context.get('product_map', {})
        product = product_map.get(obj.product_id)
        return ProductSerializerCrop(product).data if product else None
    

class OrderCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=50)
    second_name = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    comment = serializers.CharField(allow_blank=True, required=False)
    payment_type = serializers.ChoiceField(choices=[('card', 'Card'), ('cash', 'Cash')])
    items = OrderItemSerializer(many=True)

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = (
            self.context.get("request").user 
            if self.context.get("request").user.is_authenticated else None
        )

        order = Order.objects.create(user=user, **validated_data)
        total = Decimal("0.00")
        for item_data in items_data:
            # Вычисляем цену единицы с учетом доп. опций
            variant_price = Decimal(str(item_data["variant_price"]))
            extras_total = sum(Decimal(str(extra.get("price", "0.00"))) for extra in item_data.get("extras", []))
            quantity = Decimal(item_data["quantity"])

            # Вычисляем subtotal, округляя до 2 знаков после запятой
            subtotal = (variant_price + extras_total) * quantity
            subtotal = subtotal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

            # Создаем объект OrderItem с рассчитанным subtotal
            item = OrderItem.objects.create(order=order, subtotal=subtotal, **item_data)
            total += subtotal
        
        order.subtotal = total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        order.tax_amount = (order.subtotal * Decimal("0.20")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        order.final_total = (order.subtotal + order.tax_amount + Decimal(str(order.delivery_fee))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        order.save()
        return order



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_details = serializers.SerializerMethodField()  # Добавьте это


    class Meta:
        model = Order
        fields = [
            "id", "first_name", "second_name", "email", "phone",
            "address", "comment", "payment_type",
            "subtotal", "tax_amount", "delivery_fee", "final_total",
            "status", "created_at", "card_mask", "card_type", "liqpay_payment_id", "payment_details",
            "items",
        ]
        read_only_fields = fields

    def get_payment_details(self, obj):
        if obj.payment_type == 'card':
            return {
                'card_mask': obj.card_mask,
                'card_type': obj.card_type,
                'payment_id': obj.liqpay_payment_id
            }
        return None