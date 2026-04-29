from django.contrib import admin
from .models import Request, Transaction


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('requester', 'payer', 'amount', 'status', 'request_at')
    list_filter = ('status',)
    search_fields = ('requester__username', 'payer__username')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'amount', 'transaction_at')
    search_fields = ('sender__username', 'receiver__username')