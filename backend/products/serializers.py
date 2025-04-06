from rest_framework import serializers
from .models import Product, ProductVariant, ExtraOption, Ingredient

class ExtraOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraOption
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'grams', 'price']

class ProductSerializer(serializers.ModelSerializer):
    # Вложенная сериализация для вариантов и доп. опций
    variants = ProductVariantSerializer(many=True, read_only=True)
    extra_options = ExtraOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'product_type', 
            'img_url', 
            'rating', 
            'description', 
            'extra_info', 
            'variants',
            'extra_options'
        ]

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
