from rest_framework import filters
from collections import defaultdict
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Product
from .serializers import ProductSerializer, ProductDetailSerializer

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        # Получаем плоский список продуктов из стандартной реализации
        response = super().list(request, *args, **kwargs)
        data = response.data  # это список продуктов
        grouped = defaultdict(list)
        for product in data:
            # Приводим product_type к нужному виду (например, lower-case)
            key = product.get("product_type").lower()
            grouped[key].append(product)
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
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer