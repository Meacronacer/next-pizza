from django.utils import timezone
import uuid
from django.db import models
from django.conf import settings  # для ссылки на AUTH_USER_MODEL
from products.models import Product, ProductVariant, ExtraOption
from auditlog.models import AuditlogHistoryField
from auditlog.registry import auditlog

ORDER_STATUS_CHOICES = [
    ('pending',   'Ожидает оплаты'),
    ('new',       'Новый'),       # you might keep “new” for cash orders
    ('processing','В обработке'),
    ('completed', 'Завершён'),
    ('cancelled', 'Отменён'),
]


class Order(models.Model):
    history = AuditlogHistoryField()
    success_token = models.UUIDField(default=uuid.uuid4, editable=False)
    is_token_used = models.BooleanField(default=False)
    token_expiration = models.DateTimeField(default=timezone.now() + timezone.timedelta(hours=24))
    payment_date      = models.DateTimeField(null=True, blank=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='orders'
    )
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    comment = models.TextField(blank=True, null=True)
    payment_type = models.CharField(max_length=10, choices=[('card', 'Card'), ('cash', 'Cash')], default='cash')
    card_mask = models.CharField(max_length=20, blank=True, null=True)
    card_type = models.CharField(max_length=20, blank=True, null=True)
    liqpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=8, decimal_places=2, default=5.0)
    final_total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_totals(self):
        self.subtotal = sum(float(item.subtotal) for item in self.items.all())
        self.tax_amount = self.subtotal * 0.20  # 20% налог
        self.final_total = self.subtotal + self.tax_amount + float(self.delivery_fee)
        self.save()

    def __str__(self):
        return f"Order #{self.pk} - {self.user.email if self.user else 'Guest'}"

    def save(self, *args, **kwargs):
    # ensure token expires 24h after creation
        if not self.pk:
            self.token_expiration = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)

auditlog.register(Order)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    # Сохраняем основные данные продукта, чтобы при изменении цены продуктом потом историю заказа сохранить
    product_id = models.IntegerField()
    product_name = models.CharField(max_length=100)
    variant_id = models.IntegerField()
    variant_price = models.DecimalField(max_digits=6, decimal_places=2)
    extras = models.JSONField(blank=True, null=True)  # можно сохранить список доп опций в JSON
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
