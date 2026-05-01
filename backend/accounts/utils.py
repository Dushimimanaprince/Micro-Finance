from django.core.mail import send_mail
from django.conf import settings


def send_otp_email(user, code):
    subject = "Verify your MicroFinance account"
    message = f"""
    Hello {user.username},

    Your verification code is: {code}

    This code expires in 10 minutes.

    If you did not create an account, ignore this email.

    MicroFinance Team
    """
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )