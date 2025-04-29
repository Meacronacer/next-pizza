# serializers.py

from rest_framework import serializers
from .models import Product, ProductVariant, ExtraOption, Ingredient

class ExtraOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraOption
        fields = '__all__'

# Сериализатор для варианта продукта
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'price']  # Если нужно добавить другие поля, добавьте их сюда

class ProductSerializerCrop(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['description', 'img_url']  # Укажите только нужные поля

# Основной сериализатор продукта, как у вас
class ProductSerializer(serializers.ModelSerializer):
    # Теперь это поле уже есть в объекте благодаря .annotate()
    price_from = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'product_type',
            'img_url',
            'description',
            'extra_info',
            'price_from',
        ]

# Сериализатор для деталей продукта с вариантами, отсортированными по цене
class ProductDetailSerializer(ProductSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    extra_options = ExtraOptionSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + [
            'variants',
            'extra_options',
        ]


