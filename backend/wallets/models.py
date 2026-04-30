from django.db import models
from django.conf import settings
from rest_framework.views import APIView
import uuid

class UserWallet(models.Model):
    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} | balance: {self.balance}"


class LoanWallet(models.Model):
    STATUS_CHOICES = [
        ("no_loan", "No Active Loan"),
        ("active", "Active Loan"),
        ("overdue", "Overdue"),
        ("closed", "Closed"),
    ]
    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loan_wallet')
    loan_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_repaid = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="no_loan")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} | loan: {self.loan_balance} | status: {self.status}"

    @property
    def outstanding(self):
        return self.loan_balance - self.total_repaid
    

class LoanRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("closed", "Closed"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="loan_requests")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    reason = models.TextField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} requested {self.amount} [{self.status}]"


class LoanRepayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan_request = models.ForeignKey(LoanRequest, on_delete=models.CASCADE, related_name="repayments")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    repaid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.loan_request.user.username} repaid {self.amount}"
    

