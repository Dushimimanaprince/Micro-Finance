from django.db import models
from django.conf import settings


class UserWallet(models.Model):
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