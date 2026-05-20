from django.urls import path
from .views import TransferView, TransactionHistoryView, RequestViewer,TotalTransactionHistoryView,RequestView, ApproveRequestView,DepositView

urlpatterns = [
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('history/', TransactionHistoryView.as_view(), name='transaction_history'),
    path('all/', TotalTransactionHistoryView.as_view(), name='transaction_history'),
    path('requests/', RequestView.as_view(), name='requests'),
    path('requests/users/', RequestViewer.as_view(), name='requests'),
    path('requests/<uuid:id>/approve/', ApproveRequestView.as_view(), name='approve_request'),
    path('requests/<uuid:id>/decline/', ApproveRequestView.as_view(), name='reject_request'),
    path('deposit/', DepositView.as_view(), name='deposit'),
]