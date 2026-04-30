from rest_framework import serializers
from .models import UserWallet,LoanWallet,LoanRepayment,LoanRequest


class UserWalletSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= UserWallet
        fields= ("id","user","balance","created_at")
        read_only_feilds= ("id", "user","balance","created_by")
    
class LoanWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanWallet
        fields = ('id', 'user', 'loan_balance', 'total_repaid', 'outstanding', 'status', 'created_at')
        read_only_fields = ('id', 'user', 'loan_balance', 'total_repaid', 'created_at')
        
class LoanRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LoanRequest
        fields = ('id', 'user', 'username', 'amount', 'reason', 'interest_rate', 'status', 'requested_at', 'reviewed_at')
        read_only_fields = ('id', 'user', 'interest_rate', 'status', 'requested_at', 'reviewed_at')


class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = ('id', 'loan_request', 'amount', 'repaid_at')
        read_only_fields = ('id', 'repaid_at')