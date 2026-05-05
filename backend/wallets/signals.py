from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import LoanRequest


@receiver(post_save, sender=LoanRequest)
def send_loan_email(sender, instance, created, **kwargs):
    if created:

        if instance.user.email:
            send_mail(
                "Loan Request Received",
                f"Hello {instance.user.username},\n\nYour loan request of {instance.amount} has been received and is pending review.\n\nMicroFinance Team",
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                fail_silently=True,
            )
    else:
        if instance.status == "approved" and instance.user.email:
            send_mail(
                "Loan Approved",
                f"Hello {instance.user.username},\n\nYour loan request of {instance.amount} has been approved. The money has been added to your wallet.\n\nMicroFinance Team",
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                fail_silently=True,
            )
        elif instance.status == "rejected" and instance.user.email:
            send_mail(
                "Loan Rejected",
                f"Hello {instance.user.username},\n\nYour loan request of {instance.amount} has been rejected.\n\nMicroFinance Team",
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                fail_silently=True,
            )