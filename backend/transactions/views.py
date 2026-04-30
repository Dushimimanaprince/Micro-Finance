from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Transaction, Request
from wallets.models import UserWallet
from .serializer import TransactionSerializer
from decimal import Decimal

User= get_user_model()


class TransferView(APIView):
    
    def post(self,request):
        
        receiver_username= request.data.get("username")
        amount= Decimal(str(request.data.get("amount")))
        
        if not receiver_username or not amount:
            return Response(
                {"error":"Username or Amount is not Provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            receiver= User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response(
                {"error":"The user is not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        sender_wallet= UserWallet.objects.get(user=request.user)
        receiver_wallet= UserWallet.objects.get(user=receiver)
        
        try:
            admin_wallet = UserWallet.objects.get(user__username="admin")
        except UserWallet.DoesNotExist:
            return Response(
                {"error": "Admin wallet not found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
        if amount <=0 :
            return Response(
                {"error": "Minimum Sending amount should be above 0"},
                status=status.HTTP_400_BAD_REQUEST
                )
        
        cut_amount= amount *Decimal(0.02)
        total_amount= amount+cut_amount
        
        if sender_wallet.balance < total_amount:
            return Response(
                {"error":"Insufficient Funds"},
                status=status.HTTP_400_BAD_REQUEST
            )        
        
        sender_wallet.balance -= total_amount
        sender_wallet.save()
        
        receiver_wallet.balance += amount
        receiver_wallet.save()
        
        admin_wallet.balance += cut_amount
        admin_wallet.save()
        
        
        Transaction.objects.create(
            sender= request.user,
            receiver= receiver,
            amount= amount,
            purpose= "Transfer"
            
        )
        
        return Response(
            {"message": f"Succesfully sent {amount} to {receiver_username}"},
            status=status.HTTP_200_OK
        )
            
        
        
        
class TransactionHistoryView(APIView):

    def get(self, request):
        sent = Transaction.objects.filter(sender=request.user)
        received = Transaction.objects.filter(receiver=request.user)
        all_transactions = sent | received
        serializer = TransactionSerializer(all_transactions, many=True)
        return Response(serializer.data)