from django.utils.html import format_html
from django.contrib import admin
from .models import ProductType, Product, ProductVariant, ExtraOption, Ingredient

# 🔸 Варианты продукта (инлайн)
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    min_num = 1
    verbose_name = "Вариант продукта"
    verbose_name_plural = "Варианты продукта"


# 🔸 Превью изображения (общий метод)
def get_image_tag(obj):
    if obj.img_url:
        return format_html(
            '<img src="{}" width="100" height="100" style="object-fit: contain; border: 1px solid #ccc;" />',
            obj.img_url
        )
    return "-"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'product_type', 'rating', 'extra_info', 'in_stock', 'image_tag'
    )
    list_editable = ('in_stock',)  # ✅ Можно менять в списке
    readonly_fields = ('image_tag',)
    list_filter = ('product_type', 'in_stock')  # 🔍 Фильтр по наличию
    filter_horizontal = ('extra_options',)
    search_fields = ('name', 'description', 'extra_info', 'product_type__name')
    inlines = [ProductVariantInline]
    fields = (
        'product_type', 'name', 'img_url', 'image_tag',
        'rating', 'description', 'extra_info', 'extra_options', 'in_stock'
    )

    def image_tag(self, obj):
        return get_image_tag(obj)
    image_tag.short_description = 'Preview'


# 🔸 ExtraOption admin
@admin.register(ExtraOption)
class ExtraOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'image_tag')
    readonly_fields = ('image_tag',)
    fields = ('name', 'price', 'img_url', 'image_tag')

    def image_tag(self, obj):
        return get_image_tag(obj)
    image_tag.short_description = 'Превью'


# 🔸 Ingredient admin
@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'image_tag')
    readonly_fields = ('image_tag',)
    fields = ('name', 'price', 'img_url', 'image_tag')

    def image_tag(self, obj):
        return get_image_tag(obj)
    image_tag.short_description = 'Превью'

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'size', 'price')
