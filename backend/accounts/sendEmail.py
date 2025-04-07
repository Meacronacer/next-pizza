from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.core.mail import send_mail
from django.conf import settings

def generate_confirmation_token(email):
    """
    Генерирует подписанный токен для email, который можно проверить с учетом времени жизни.
    """
    signer = TimestampSigner()
    token = signer.sign(email)
    return token

def verify_confirmation_token(token, max_age=3600):
    signer = TimestampSigner()
    try:
        email = signer.unsign(token, max_age=max_age)
        return email
    except (BadSignature, SignatureExpired):
        return None

def send_confirmation_email(user):
    token = generate_confirmation_token(user.email)
    confirm_url = f"{settings.FRONTEND_URL}/confirm-email/{token}/"
    subject = "Подтверждение Email"
    message = f"Здравствуйте {user.first_name},\n\nЧтобы подтвердить ваш email, перейдите по ссылке: {confirm_url}\n\nЕсли вы не регистрировались, проигнорируйте это письмо."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
    send_mail(subject, message, from_email, recipient_list)
