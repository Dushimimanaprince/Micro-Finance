from django.db import models
from django.conf import settings


class Request(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("declined", "Declined"),
    ]
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="requests_made")
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="requests_to_pay")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    purpose = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    request_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester.username} requested {self.amount} from {self.payer.username} [{self.status}]"


class Transaction(models.Model):

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_transactions", null=True, blank=True)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_transactions")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    purpose = models.CharField(max_length=20,)
    transaction_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        sender_name = self.sender.username if self.sender else "SYSTEM"
        return f"{sender_name} -> {self.receiver.username} | {self.purpose} | {self.amount}"