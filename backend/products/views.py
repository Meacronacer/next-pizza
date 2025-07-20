from rest_framework import filters
from collections import OrderedDict
from rest_framework.response import Response
from django.db.models import Case, When, Value, IntegerField, Min, Prefetch
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Product, ProductVariant, ProductType
from .serializers import ProductSerializer, ProductDetailSerializer
from django.core.cache import cache


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .annotate(price_from=Min('variants__price'))
            .select_related('product_type')  # Предотвращает N+1
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # ⏱️ Используем кэш на 1 час
        product_types = cache.get('product_types_ordered')
        if product_types is None:
            product_types = list(ProductType.objects.order_by('order').values_list('name', flat=True))
            cache.set('product_types_ordered', product_types, timeout=3600)  # 1 час

        # Создание групп
        grouped = OrderedDict((pt.lower(), []) for pt in product_types)
        uncategorized_key = 'Shared'
        grouped[uncategorized_key] = []

        for product in data:
            pt = product.get('product_type')
            key = pt['name'].lower() if pt and pt.get('name') else uncategorized_key
            grouped.setdefault(key, []).append(product)

        return Response(grouped)
    

class ProductFlatListView(ListAPIView):
    queryset = Product.objects.annotate(price_from=Min('variants__price'))
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields   = ['name', 'description']


class ProductDetailView(RetrieveAPIView):
    queryset = (
        Product.objects
        .annotate(price_from=Min('variants__price'))
        .prefetch_related(
            Prefetch('variants', queryset=ProductVariant.objects.order_by('price')),
            'extra_options'
        )
    )
    serializer_class = ProductDetailSerializer
