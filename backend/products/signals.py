from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import ProductType, Product

@receiver([post_save, post_delete], sender=ProductType)
def clear_product_type_cache(sender, **kwargs):
    cache.delete('product_types_ordered')

@receiver([post_save, post_delete], sender=Product)
def clear_product_cache(sender, **kwargs):
    cache.delete('product_list')