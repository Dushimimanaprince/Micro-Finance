from django.contrib import admin
from .models import UserWallet, LoanWallet, LoanRequest, LoanRepayment



@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at')
    search_fields = ('user__username',)


@admin.register(LoanWallet)
class LoanWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'loan_balance', 'total_repaid', 'status')
    list_filter = ('status',)
    search_fields = ('user__username',)
    

@admin.register(LoanRequest)
class LoanRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'status', 'interest_rate', 'requested_at')
    list_filter = ('status',)
    search_fields = ('user__username',)


@admin.register(LoanRepayment)
class LoanRepaymentAdmin(admin.ModelAdmin):
    list_display = ('loan_request', 'amount', 'repaid_at')