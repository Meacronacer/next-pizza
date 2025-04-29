from rest_framework import filters
from collections import defaultdict
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Product, ProductVariant
from .serializers import ProductSerializer, ProductDetailSerializer
from django.db.models import Min, Prefetch



class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
                   .annotate(price_from=Min('variants__price'))
                   .prefetch_related(
                       Prefetch('variants', queryset=ProductVariant.objects.order_by('price')),
                       'extra_options'
                   )
                   .only('id','name','product_type','img_url','description','extra_info','price_from')
        )

    def list(self, request, *args, **kwargs):
        data = super().list(request, *args, **kwargs)
        grouped = defaultdict(list)
        for item in data.data:
            grouped[item['product_type'].lower()].append(item)
        return Response(grouped)


class ProductFlatListView(ListAPIView):
    """
    Возвращает простой список всех продуктов (с опциональным search-фильтром).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    # если вы хотите возможность ?search=…
    filter_backends = [filters.SearchFilter]
    search_fields   = ['name', 'description']  # добавьте нужные поля

# Новое представление для получения деталей конкретного продукта
class ProductDetailView(RetrieveAPIView):
    serializer_class = ProductDetailSerializer

    def get_queryset(self):
        return (
            Product.objects
                   .annotate(price_from=Min('variants__price'))
                   .prefetch_related(
                       Prefetch('variants', queryset=ProductVariant.objects.order_by('price')),
                       'extra_options'
                   )
                   .only('id','name','product_type','img_url','description','extra_info','price_from')
        )