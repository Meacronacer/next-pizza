from django.db import models

# Create your models here.
from django.db import models

RATING_CHOICES = (
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
)

class Product(models.Model):
    # Вы можете добавить сюда и другие типы, если понадобится
    PIZZAS = 'Pizzas'
    SNACKS = 'Snacks'
    BEVERAGES = 'Beverages'
    COCKTAILS = 'Cocktails'
    COFFE = 'Coffe'
    DESERTS = 'Desserts'
    SAUCES = 'Sauces'

    PRODUCT_TYPE_CHOICES = [
        (PIZZAS, 'Pizzas'),
        (SNACKS, 'Snacks'),
        (BEVERAGES, 'Beverages'),
        (COCKTAILS, 'Cocktails'),
        (COFFE, 'Coffe'),
        (DESERTS, 'Desserts'),
        (SAUCES, 'Sauces'),
    ]


    name = models.CharField(max_length=50)
    product_type = models.CharField(
        max_length=50,
        choices=PRODUCT_TYPE_CHOICES,
        db_index=True  # индекс ускорит любые запросы по этому полю
    )
    img_url = models.URLField()
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES, default=4)
    description = models.TextField(max_length=500, blank=True)
    extra_info = models.CharField(max_length=50, blank=True)
    # Дополнительные опции (например, доп. сыр, оливки и т.д.)
    extra_options = models.ManyToManyField('ExtraOption', blank=True, related_name='products')

    def __str__(self):
        return f'{self.product_type}: {self.name}'


class ProductVariant(models.Model):
    """
    Модель варианта продукта:
      - size: размер в см (если применимо);
      - grams: вес в граммах;
      - price: цена для данного варианта.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Размер в см (если применимо)")
   # grams = models.PositiveIntegerField(blank=True, null=True, help_text="Вес в граммах")
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        size_display = f"{self.size} см" if self.size else "Один размер"
        return f'{self.product.name} - {size_display}'


class ExtraOption(models.Model):
    """
    Дополнительные опции, которые можно добавить к продукту.
    Например: дополнительный сыр, оливки, соус и т.д.
    """
    name = models.CharField(max_length=70)
    img_url = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f'{self.name} | {self.price}'


class Ingredient(models.Model):
    """
    Модель ингредиента (если требуется для рецептуры или для показа состава продукта).
    """
    name = models.CharField(max_length=70)
    img_url = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f'{self.name} | {self.price}'
