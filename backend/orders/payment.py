import base64
import hashlib
import json
from django.conf import settings

def generate_liqpay_data(order):
    data = {
        "action": "pay",
        "amount": str(order.final_total),
        "currency": "USD",
        "description": f"Оплата заказа #{order.pk}",
        "order_id": str(order.pk),
        "version": "3",
        "public_key": settings.LIQPAY_PUBLIC_KEY,
        "server_url": settings.LIQPAY_CALLBACK_URL,  # URL для уведомлений
        "result_url": f"{settings.LIQPAY_RESULT_URL.format(order_id=order.id, token=order.success_token)}", 
        "sandbox":     "1", 
    }
    json_data = json.dumps(data)
    data_base64 = base64.b64encode(json_data.encode("utf-8")).decode("utf-8")
    return data_base64

def generate_liqpay_signature(data_base64):
    # Signature: base64( sha1( private_key + data + private_key ) )
    sign_string = settings.LIQPAY_PRIVATE_KEY + data_base64 + settings.LIQPAY_PRIVATE_KEY
    sha1_hash = hashlib.sha1(sign_string.encode("utf-8")).digest()
    signature = base64.b64encode(sha1_hash).decode("utf-8")
    return signature
