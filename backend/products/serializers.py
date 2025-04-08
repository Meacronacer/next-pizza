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

# Основной сериализатор продукта, как у вас
class ProductSerializer(serializers.ModelSerializer):
    price_from = serializers.SerializerMethodField()

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

    def get_price_from(self, obj):
        variants = obj.variants.all()
        if variants.exists():
            return min(variant.price for variant in variants)
        return None

# Сериализатор для деталей продукта с вариантами, отсортированными по цене
class ProductDetailSerializer(ProductSerializer):
    variants = serializers.SerializerMethodField()
    extra_options = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ['variants', 'extra_options']

    
    def get_extra_options(self, obj):
        options = obj.extra_options.all()
        return ExtraOptionSerializer(options, many=True).data

    def get_variants(self, obj):
        # Получаем все варианты для данного продукта и сортируем их по цене от меньшей к большей
        variants = obj.variants.all().order_by('price')
        return ProductVariantSerializer(variants, many=True).data


