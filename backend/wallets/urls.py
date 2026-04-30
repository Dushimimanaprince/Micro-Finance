from django.urls import path
from .views import UserWalletView, LoanWalletView, LoanRequestView, ApproveLoanView, LoanRepaymentView

urlpatterns = [
    path('', UserWalletView.as_view(), name='wallet'),
    path('loan/', LoanWalletView.as_view(), name='loan_wallet'),
    path('loan/request/', LoanRequestView.as_view(), name='loan_request'),
    path('loan/repay/', LoanRepaymentView.as_view(), name='loan_repay'),
    path('loan/approve/<uuid:id>/', ApproveLoanView.as_view(), name='approve_loan'),
    path('loan/approve/', ApproveLoanView.as_view(), name='approve_loan'),
]