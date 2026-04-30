from rest_framework import serializers
from .models import UserWallet,LoanWallet


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