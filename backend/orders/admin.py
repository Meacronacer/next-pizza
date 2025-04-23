from django.contrib import admin
from django.utils.html import format_html, format_html_join, mark_safe
from django.urls import reverse
from .models import Order, OrderItem
from products.models import Product

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    fields = (
        'product_image',
        'product_link',
        'variant_info',
        'formatted_extras',
        'quantity',
        'subtotal',
    )
    readonly_fields = fields
    extra = 0
    classes = ['collapse']  # Сворачиваем по умолчанию

    def product_image(self, obj):
        # Пытаемся найти связанный продукт
        try:
            product = Product.objects.get(pk=obj.product_id)
            url = product.img_url
        except Product.DoesNotExist:
            return "-"
        # Выводим мини-превью
        return format_html(
            '<img src="{}" style="max-height:50px; max-width:50px; object-fit:cover; border-radius:4px;" />',
            url
        )
    product_image.short_description = "Image"

    def product_link(self, obj):
        url = reverse("admin:products_product_change", args=[obj.product_id])
        return format_html('<a href="{}">{}</a>', url, obj.product_name)
    product_link.short_description = "Товар"

    def variant_info(self, obj):
        url = reverse("admin:products_productvariant_change", args=[obj.variant_id])
        return format_html(
            '<a href="{}">Вариант #{}</a> (${})', 
            url, 
            obj.variant_id, 
            obj.variant_price
        )
    variant_info.short_description = "Вариант"

    def formatted_extras(self, obj):
        if not obj.extras:
            return "-"
        
        return format_html_join(
            mark_safe('<br>'),
            '<div class="extra-item" style="margin: 2px 0; padding: 3px; border-bottom: 1px solid #eee;">'
            '{}<span style="margin-left: 8px;">${}</span>'
            '</div>',
            (
                (
                    format_html(
                        '<img src="{}" alt="{}" style="height:20px; width:auto; vertical-align: middle; margin-right: 5px;">{}',
                        extra.get("img_url", "/static/images/no-image.png"),
                        extra.get("name", ""),
                        extra.get("name", "")
                    ),
                    extra.get("price", 0)
                )
                for extra in obj.extras
            )
        )
    formatted_extras.short_description = "Дополнительно"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_id',
        'user_link',
        'short_address',
        'payment_status',
        'price_summary',
        'status_badge',
        'created_at',
    )
    list_filter = (
        'status',
        'payment_type',
        ('created_at', admin.DateFieldListFilter),
    )
    search_fields = (
        'id',
        'user__email',
        'phone',
        'address',
        'email'
    )
    readonly_fields = (
        'created_at',
        'payment_details',
        'order_timeline'
    )
    inlines = [OrderItemInline]
    actions = ['mark_completed', 'mark_cancelled']
    date_hierarchy = 'created_at'
    list_per_page = 20

    fieldsets = (
        ("Основная информация", {
            'fields': (
                'status',
                'user',
                ('first_name', 'second_name'),
                ('email', 'phone'),
                'address',
                'comment'
            )
        }),
        ("Финансовая информация", {
            'fields': (
                ('subtotal', 'tax_amount'),
                ('delivery_fee', 'final_total'),
                'payment_type',
                'payment_details'
            ),
            'classes': ('collapse',)
        }),
        ("Дополнительно", {
            'fields': (
                'created_at',
                'order_timeline'
            ),
            'classes': ('collapse',)
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        readonly = super().get_readonly_fields(request, obj)
        if obj and obj.status in ['completed', 'cancelled']:
            return readonly + ('payment_type', 'address', 'user')
        return readonly

    def order_id(self, obj):
        return format_html(
            '<strong>#{}</strong>',
            obj.id
        )
    order_id.short_description = "ID"

    def user_link(self, obj):
        if obj.user:
            url = reverse("admin:auth_user_change", args=[obj.user.id])
            return format_html(
                '<a href="{}">{} {}</a><br><small>{}</small>', 
                url, 
                obj.first_name, 
                obj.second_name, 
                obj.email
            )
        return f"{obj.first_name} {obj.second_name} (гость)"
    user_link.short_description = "Клиент"
    user_link.admin_order_field = 'user__email'

    def short_address(self, obj):
        return obj.address[:50] + "..." if len(obj.address) > 50 else obj.address
    short_address.short_description = "Адрес"

    def payment_status(self, obj):
        color = '#28a745' if obj.payment_type == 'card' else '#6c757d'
        icon = '💳' if obj.payment_type == 'card' else '💰'
        return format_html(
            '<div style="color: {}; font-weight: 500;">{} {}</div>',
            color,
            icon,
            "Онлайн" if obj.payment_type == 'card' else "Наличные"
        )
    payment_status.short_description = "Оплата"

    def price_summary(self, obj):
        return format_html(
            '<div style="white-space: nowrap;">'
            '<div>Итого: <b>${}</b></div>'
            '<small style="color: #666;">(Товары: ${} + Налог: ${} + Доставка: ${})</small>'
            '</div>',
            obj.final_total,
            obj.subtotal,
            obj.tax_amount,
            obj.delivery_fee
        )
    price_summary.short_description = "Сумма"

    def status_badge(self, obj):
        colors = {
            'pending':    '#6c757d',   # new!
            'new':        '#17a2b8',
            'processing': '#ffc107',
            'completed':  '#28a745',
            'cancelled':  '#dc3545',
        }
        icons = {
            'pending':    '⏳',
            'new':        '🆕',
            'processing': '⚙️',
            'completed':  '✅',
            'cancelled':  '❌',
        }
        color = colors.get(obj.status, '#6c757d')
        icon  = icons.get(obj.status,  '❔')
        return format_html(
            '<div style="background:{}; color:white; padding:2px 8px; border-radius:12px;">{} {}</div>',
            color,
            icon,
            obj.get_status_display()
        )
    status_badge.short_description = "Статус"


    def payment_details(self, obj):
        if obj.payment_type == 'card':
            return format_html(
                '<div class="payment-details">'
                '<div>Карта: <b>{}</b> ({})</div>'
                '<div>ID платежа: {}</div>'
                '</div>',
                obj.card_mask or 'N/A',
                obj.card_type or 'Неизвестно',
                obj.liqpay_payment_id or 'N/A'
            )
        return "Наличная оплата"
    payment_details.short_description = "Детали оплаты"

    def order_timeline(self, obj):
        status_changes = [
            (obj.created_at, 'Создан')
            # Добавьте здесь другие статусы при необходимости
        ]
        return format_html_join(
            '<br>',
            '<div style="display: flex; align-items: center; margin: 5px 0;">'
            '<div style="width: 100px;">{}</div>'
            '<div style="flex-grow: 1;">{}</div>'
            '</div>',
            ((date.strftime('%d.%m.%Y %H:%M'), status) for date, status in status_changes)
        )
    order_timeline.short_description = "История изменений"

    @admin.action(description="Пометить как завершенные")
    def mark_completed(self, request, queryset):
        queryset.update(status='completed')

    @admin.action(description="Пометить как отмененные")
    def mark_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
