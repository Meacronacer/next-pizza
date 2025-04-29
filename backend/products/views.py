from rest_framework import filters
from rest_framework.response import Response
from django.db.models import Case, When, Value, IntegerField, Min, Prefetch
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Product, ProductVariant
from .serializers import ProductSerializer, ProductDetailSerializer


class ProductListView(ListAPIView):
    queryset = (
        Product.objects
        # Аннотируем минимальную цену сразу
        .annotate(price_from=Min('variants__price'))
        # Аннотируем ранг product_type в соответствии с порядком в PRODUCT_TYPE_CHOICES
        .annotate(
            type_order=Case(
                When(product_type=Product.PIZZAS,    then=Value(0)),
                When(product_type=Product.SNACKS,    then=Value(1)),
                When(product_type=Product.BEVERAGES, then=Value(2)),
                When(product_type=Product.COCKTAILS, then=Value(3)),
                When(product_type=Product.COFFE,     then=Value(4)),
                When(product_type=Product.DESERTS,   then=Value(5)),
                When(product_type=Product.SAUCES,    then=Value(6)),
                output_field=IntegerField(),
            )
        )
        # Сортируем по рангам
        .order_by('type_order')
    )
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        from collections import defaultdict
        response = super().list(request, *args, **kwargs)
        data = response.data
        grouped = defaultdict(list)
        for product in data:
            grouped[product['product_type'].lower()].append(product)
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
