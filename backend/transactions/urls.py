from django.urls import path
from .views import TransferView, TransactionHistoryView, RequestView, ApproveRequestView

urlpatterns = [
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('history/', TransactionHistoryView.as_view(), name='transaction_history'),
    path('requests/', RequestView.as_view(), name='requests'),
    path('requests/<uuid:id>/approve/', ApproveRequestView.as_view(), name='approve_request'),
]