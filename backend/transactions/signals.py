from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from django.core.mail import send_mail

from .models import Request, Transaction

@receiver(post_save, sender=Transaction)
def send_transaction_email(sender,instance, created,**kwargs):
    
    if created:
        
        if instance.receiver.email:
            send_mail(
                f"You have received money",
                f"""Hello {instance.receiver.first_name} {instance.receiver.last_name}\n \n 
                you have received {instance.amount} via MicroFinance.\n\n
                Purpose{instance.purpose}\n\nMicro Finance Team""",
                
                settings.DEFAULT_FROM_EMAIL,
                [instance.receiver.email],
                fail_silently=True,
            )
        
        if instance.sender and instance.sender.email:
            send_mail(
                "Transfer successful",
                f"Hello {instance.sender.username},\n\nYou have sent {instance.amount} successfully.\n\nPurpose: {instance.purpose}\n\nMicroFinance Team",
                settings.DEFAULT_FROM_EMAIL,
                [instance.sender.email],
                fail_silently=True,
            )
            
@receiver(post_save, sender=Request)
def send_request_email(sender, instance, created, **kwargs):
    if created:
        if instance.payer.email:
            send_mail(
                "You have a payment request",
                f"Hello {instance.payer.username},\n\n{instance.requester.username} is requesting {instance.amount} from you.\n\nPurpose: {instance.purpose}\n\nLogin to approve or decline.\n\nMicroFinance Team",
                settings.DEFAULT_FROM_EMAIL,
                [instance.payer.email],
                fail_silently=True,
            )
