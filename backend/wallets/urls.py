from django.urls import path
from .views import UserWalletView, LoanWalletView

urlpatterns = [
    path('', UserWalletView.as_view(), name='wallet'),
    path('loan/', LoanWalletView.as_view(), name='loan_wallet'),
]