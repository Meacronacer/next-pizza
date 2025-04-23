from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from products.models import Product, ProductVariant, ExtraOption


@api_view(['GET'])
def get_cart(request):
    """
    Получает корзину из сессии в виде массива объектов и рассчитывает subtotal для каждого элемента.
    """
    cart = request.session.get('cart', [])

    for item in cart:
        # Расчет базовой суммы (цена товара * количество)
        base_total = item["price"] * item["quantity"]
        # Расчет суммы для дополнительных опций: цена каждого extra * количество товара
        extras_total = sum(extra["price"] for extra in item.get("extras", [])) * item["quantity"]
        item["subtotal"] = base_total + extras_total
    return Response(cart, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_to_cart(request):
    """
    Добавляет товар в корзину.
    Ожидаемые данные:
      - product_id: ID продукта
      - variant_id: ID выбранного варианта
      - extras: список ID дополнительных опций (опционально)
      - quantity: количество (по умолчанию 1)
    
    В корзине сохраняется массив объектов, где поле extras содержит полные данные опций.
    """
    product_id = request.data.get("product_id")
    variant_id = request.data.get("variant_id")
    extras = request.data.get("extras", [])
    
    try:
        quantity = int(request.data.get("quantity", 1))
    except (ValueError, TypeError):
        quantity = 1

    if not (product_id and variant_id):
        return Response(
            {"error": "Необходимо указать product_id и variant_id"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Получаем продукт и вариант
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Продукт не найден"},
            status=status.HTTP_404_NOT_FOUND
        )
    try:
        variant = product.variants.get(id=variant_id)
    except ProductVariant.DoesNotExist:
        return Response(
            {"error": "Вариант продукта не найден"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Если переданы extra-опции (как список ID), получаем их полные данные из БД
    extras_details = []
    if extras:
        extras_objs = ExtraOption.objects.filter(id__in=extras)
        extras_details = [
            {
                "id": extra.id,
                "name": extra.name,
                "price": float(extra.price),
                "img_url": extra.img_url,
            }
            for extra in extras_objs
        ]
        # Для формирования уникального ключа используем только айди
        extras_key = "_".join(map(str, sorted(extras)))
    else:
        extras_key = ''

    # Формируем уникальный ключ на основе product_id, variant_id и extras_key
    unique_key = f"{product_id}_{variant_id}_{extras_key}"

    # Получаем корзину из сессии (если ее нет, создаем пустой массив)
    cart = request.session.get('cart', [])
    
    # Если уже есть позиция с таким уникальным ключом, увеличиваем количество
    item_found = False
    for item in cart:
        if item.get("key") == unique_key:
            item["quantity"] += quantity
            item_found = True
            break

    # Если такой позиции нет, добавляем новый объект
    if not item_found:
        new_item = {
            "key": unique_key,              # Уникальный идентификатор позиции
            "product_id": product_id,
            "variant_id": variant_id,
            "extras": extras_details,       # Массив с полными данными extra-опций
            "quantity": quantity,
            "price": float(variant.price),
            "name": product.name,
            "img_url": product.img_url,
        }
        cart.append(new_item)

    # Сохраняем обновленную корзину в сессии
    request.session['cart'] = cart
    request.session.modified = True

    return Response(cart, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_cart_item_quantity(request):
    """
    Обновляет количество товара в корзине.
    Ожидаемые данные:
      - item_key: уникальный ключ позиции в корзине
      - quantity: новое количество (если 0 или меньше, товар удаляется)
    """
    item_key = request.data.get("item_key")
    try:
        quantity = int(request.data.get("quantity", 1))
    except (ValueError, TypeError):
        return Response({"error": "Некорректное количество"}, status=status.HTTP_400_BAD_REQUEST)

    cart = request.session.get('cart', [])
    for item in cart:
        if item.get("key") == item_key:
            if quantity > 0:
                item["quantity"] = quantity
            else:
                cart.remove(item)
            break
    else:
        return Response({"error": "Товар не найден в корзине"}, status=status.HTTP_404_NOT_FOUND)

    request.session['cart'] = cart
    request.session.modified = True

    return Response({'message': 'item quantity updated'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def edit_cart_item(request):
    """
    Обновляет позицию в корзине, позволяя изменить вариант (например, размер) и/или extra-опции.
    
    Ожидаемые данные:
      - item_key: текущий уникальный ключ позиции в корзине, которую нужно изменить
      - variant_id: новый ID выбранного варианта продукта
      - extras: (опционально) новый список ID доп. опций

    Логика:
      1. Находим существующую позицию по item_key.
      2. Получаем продукт по product_id из найденной позиции.
      3. Запрашиваем новый вариант по variant_id и новые extra-опции (если заданы).
      4. Формируем новый уникальный ключ для позиции.
      5. Удаляем старую позицию и либо объединяем с уже существующей позицией с таким ключом, либо добавляем обновлённую позицию.
    """
    item_key = request.data.get("item_key")
    new_variant_id = request.data.get("variant_id")
    extras = request.data.get("extras", [])
    
    # Если количество не передано, оставляем старое, иначе приводим к целому
    try:
        new_quantity = int(request.data.get("quantity", None)) if request.data.get("quantity") is not None else None
    except (ValueError, TypeError):
        new_quantity = None

    if item_key is None or not new_variant_id:
        return Response(
            {"error": "Необходимо указать item_key и variant_id"},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Получаем текущую корзину (как массив объектов)
    cart = request.session.get('cart', [])
    
    # Ищем позицию в корзине по заданному item_key
    old_item = None
    index = None
    for idx, item in enumerate(cart):
        if item.get("key") == item_key:
            old_item = item
            index = idx
            break
    
    if old_item is None:
        return Response({"error": "Позиция не найдена в корзине"}, status=status.HTTP_404_NOT_FOUND)
    
    product_id = old_item.get("product_id")
    
    # Получаем продукт и новый вариант
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Продукт не найден"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        new_variant = product.variants.get(id=new_variant_id)
    except ProductVariant.DoesNotExist:
        return Response({"error": "Новый вариант продукта не найден"}, status=status.HTTP_404_NOT_FOUND)
    
    # Обрабатываем новые extra-опции: если заданы, получаем их полные данные
    extras_details = []
    if extras:
        extras_objs = ExtraOption.objects.filter(id__in=extras)
        extras_details = [
            {
                "id": extra.id,
                "name": extra.name,
                "price": float(extra.price),
                "img_url": extra.img_url,
            }
            for extra in extras_objs
        ]
        extras_key = "_".join(map(str, sorted(extras)))
    else:
        extras_key = ''
    
    # Формируем новый уникальный ключ на основе product_id, нового variant_id и extras_key
    new_unique_key = f"{product_id}_{new_variant_id}_{extras_key}"
    
    # Если новое количество не указано, сохраняем исходное
    if new_quantity is None:
        new_quantity = old_item.get("quantity", 1)
    
    # Формируем новую позицию
    updated_item = {
        "key": new_unique_key,
        "product_id": product_id,
        "variant_id": new_variant_id,
        "extras": extras_details,
        "quantity": new_quantity,
        "price": float(new_variant.price),
        "name": product.name,
        "img_url": product.img_url,
    }
    
    # Удаляем старую позицию
    cart.pop(index)
    
    # Если уже существует позиция с новым уникальным ключом, объединяем их (увеличивая количество)
    let_found = False
    for item in cart:
        if item.get("key") == new_unique_key:
            item["quantity"] += new_quantity
            let_found = True
            break
    if not let_found:
        cart.append(updated_item)
    
    # Сохраняем обновленную корзину в сессии
    request.session['cart'] = cart
    request.session.modified = True
    
    return Response({'message': 'cart item edited successfully!'}, status=status.HTTP_200_OK)



@api_view(['POST'])
def clear_cart(request):
    """
    Очищает корзину, удаляя все товары.
    """
    # Присваиваем пустой массив корзине
    request.session['cart'] = []
    request.session.modified = True

    return Response({"message": "Корзина очищена"}, status=status.HTTP_200_OK)