from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializer import LoanWalletSerializer,UserWalletSerializer,LoanRequestSerializer
from .models import LoanWallet,UserWallet
from decimal import Decimal
from wallets.models import LoanRepayment, LoanRequest
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from django.template.context_processors import request

from transactions.models import Transaction

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
    
class LoanRequestView(APIView):
    
    def post(self,request):
        
        amount= Decimal(str(request.data.get("amount")))
        reason= request.data.get("reason")
        
        if not amount or not reason:
            return Response(
                {"error":"Please Provide amount or Reason"},
                status=status.HTTP_400_BAD_REQUEST
            ) 
        
        if amount <= 0:
            return Response(
                {"error":"Amount should be Above 0"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        active_loan= LoanRequest.objects.filter(
            user= request.user,
            status__in=["pending","approved"]
        ).exists()
        
        if active_loan:
            return Response(
                {"error":"Please First pay the First Loan"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        loan= LoanRequest.objects.create(
            user= request.user,
            amount=amount,
            reason=reason
        )
        
        serializer= LoanRequestSerializer(loan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        loans = LoanRequest.objects.filter(user=request.user)
        serializer = LoanRequestSerializer(loans, many=True)
        return Response(serializer.data)
    
class ApproveLoanView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        loans = LoanRequest.objects.all()
        serializer = LoanRequestSerializer(loans, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        try:
            loan_request = LoanRequest.objects.get(id=id)
        except LoanRequest.DoesNotExist:
            return Response(
                {"error": "Loan request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if loan_request.status != "pending":
            return Response(
                {"error": "This loan has already been reviewed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = loan_request.amount
        interest = amount * Decimal('0.16')
        total_amount = amount + interest


        user_wallet = UserWallet.objects.get(user=loan_request.user)
        user_wallet.balance += amount
        user_wallet.save()


        loan_wallet, created = LoanWallet.objects.get_or_create(user=loan_request.user)
        loan_wallet.loan_balance = total_amount
        loan_wallet.status = "active"
        loan_wallet.save()


        loan_request.status = "approved"
        loan_request.reviewed_at = timezone.now()
        loan_request.save()
        
        Transaction.objects.create(
            sender= None,
            receiver= loan_request.user,
            purpose= f"Loan Request of {amount}"
        )

        return Response(
            {"message": "Loan approved successfully"},
            status=status.HTTP_200_OK
        )
        
    def delete(self,request,id):
        
        try:
            loan_request= LoanRequest.objects.get(id=id)
        except LoanRequest.DoesNotExist:
            return Response(
                {"error":"Loan Request not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if loan_request.status != "pending":
            return Response(
                {"error":"The Loan Arleady been reveiwed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        loan_request.status= "rejected"
        loan_request.reviewed_at = timezone.now()
        loan_request.save()
        
        return Response(
            {"message": "Loan rejected successfully"},
            status=status.HTTP_200_OK
        )
        
class LoanRepaymentView(APIView):
    
    def post(self,request):
        
        amount= Decimal(str(request.data.get("amount")))
        
        if amount <= 0:
            return Response(
                {"error":"The Amount Should be Above 0"}
            )
        try:
            loan_wallet= LoanWallet.objects.get(
                user=request.user,
                status="active"
            )
        except LoanWallet.DoesNotExist:
            return Response(
                {"error":"You have no Loan"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        user_wallet= UserWallet.objects.get(user=request.user)
        
        try:
            admin_wallet= UserWallet.objects.get(user__username="admin")
            
        except UserWallet.DoesNotExist:
            return Response(
                {"error":"User not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if user_wallet.balance < amount:
            return Response(
                {"error":"Insufficent Funds"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_wallet.balance -= amount
        user_wallet.save()
        
        admin_wallet.balance += amount
        admin_wallet.save()
        
        loan_request= LoanRequest.objects.get(
            user= request.user,
            status= "approved"
        )
        
        loan_wallet.loan_balance -=amount
        loan_wallet.total_repaid +=amount
        loan_wallet.save()
        
        if loan_wallet.loan_balance == 0:
            loan_wallet.status = "closed"
            loan_wallet.save()
            loan_request.status="closed"
            loan_request.save()
            
        LoanRepayment.objects.create(
            loan_request=loan_request,
            amount=amount
        )
        
        Transaction.objects.create(
            sender=request.user,
            receiver=request.user,
            amount=amount,
            purpose="loan_repayment"
        )
        
        return Response(
            {"message": f"Repayment of {amount} successful. Remaining balance: {loan_wallet.loan_balance}"},
            status=status.HTTP_200_OK
        )
        
        
        
    