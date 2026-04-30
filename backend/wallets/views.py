from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializer import LoanWalletSerializer,UserWalletSerializer
from .models import LoanWallet,UserWallet



class UserWalletView(APIView):
    
    def get(self,request):
        
        wallet= UserWallet.objects.get(user=request.user)
        serializer= UserWalletSerializer(wallet)
        return Response(serializer.data)
    
class LoanWalletView(APIView):
    
    def get(self,request):
        
        try:
        
            loan_wallet= LoanWallet.objects.get(user=request.user)
            serializer=  LoanWalletSerializer(loan_wallet)
            return Response(serializer.data)
        
        except LoanWallet.DoesNotExist:
            return Response(
                {"error":"The Loan Wallet not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    