from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from django.dispatch import receiver
from rest_framework import status
from .models import Transaction, Request
from wallets.models import UserWallet
from .serializer import TransactionSerializer,RequestSerializer
from decimal import Decimal
from transactions.serializer import RequestSerializer
from transactions.models import Request
import functools
from django.conf import settings

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

class TotalTransactionHistoryView(APIView):

    def get(self, request):
        all= Transaction.objects.all()
        serializer = TransactionSerializer(all, many=True)
        return Response(serializer.data)    

class RequestView(APIView):

    def post(self, request):
        amount = Decimal(str(request.data.get("amount")))
        payer_username = request.data.get("payer")
        purpose = request.data.get("purpose")

        if amount <= 0:
            return Response(
                {"error": "Amount should be above 0"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            payer = User.objects.get(username=payer_username)
        except User.DoesNotExist:
            return Response(
                {"error": "Payer not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        Request.objects.create(
            requester=request.user,
            payer=payer,
            amount=amount,
            purpose=purpose,
            status="pending"
        )

        return Response(
            {"message": f"Payment {amount} request sent to {payer_username} wait to be Approved"},
            status=status.HTTP_201_CREATED
        )

    def get(self, request):
        requests = Request.objects.filter(payer=request.user)
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    
class RequestViewer(APIView):

    def get(self,request):

        requests= Request.objects.filter(requester=request.user)
        serializer= RequestSerializer(requests,many=True)
        return Response(serializer.data)


class ApproveRequestView(APIView):

    def post(self, request, id):
        try:
            payment_request = Request.objects.get(id=id)
        except Request.DoesNotExist:
            return Response(
                {"error": "Request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment_request.payer != request.user:
            return Response(
                {"error": "You are not authorized to approve this request"},
                status=status.HTTP_403_FORBIDDEN
            )

        if payment_request.status == "paid":
            return Response(
                {"error": "This request is already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )
        purpose= payment_request.purpose

        amount = payment_request.amount
        cut_amount = amount * Decimal('0.02')
        total_amount = amount + cut_amount

        payer_wallet = UserWallet.objects.get(user=request.user)
        requester_wallet = UserWallet.objects.get(user=payment_request.requester)

        try:
            admin_wallet = UserWallet.objects.get(user__username="admin")
        except UserWallet.DoesNotExist:
            return Response(
                {"error": "Admin wallet not found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if payer_wallet.balance < total_amount:
            return Response(
                {"error": "Insufficient funds"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payer_wallet.balance -= total_amount
        payer_wallet.save()

        requester_wallet.balance += amount
        requester_wallet.save()

        admin_wallet.balance += cut_amount
        admin_wallet.save()

        payment_request.status = "paid"
        payment_request.save()

        Transaction.objects.create(
            sender=request.user,
            receiver=payment_request.requester,
            amount=amount,
            purpose=f"Request Payment {purpose}"
        )

        return Response(
            {"message": "Payment approved successfully"},
            status=status.HTTP_200_OK
        )
    
    def delete(self,request,id):

        try:
            request_payment=Request.objects.get(id=id)
        except Request.DoesNotExist:
            return Response(
                {"error":"Request Not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        request_payment.status = "declined"
        request_payment.save()

        return Response(
            {"error":"Payment Rejected Successfully"},
            status=status.HTTP_200_OK
        )
        
class DepositView(APIView):
    
    permission_classes = [IsAdminUser]
    
    def post(self,request):
        
        receiver_username= request.data.get("username")
        amount= Decimal(str(request.data.get("amount")))
        
        if not receiver_username or not amount:
            return Response(
                {"error":"Please provide username or amount"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            receiver= User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response(
                {"error":"The user Doesn't Exist Please provide Valid User"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if amount <= 0:
            return Response(
                {"error":"The amount Should be Above 0"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        receiver_wallet= UserWallet.objects.get(user=receiver)
        
        receiver_wallet.balance += amount
        receiver_wallet.save()
        
        admin= User.objects.get(username="admin")
        
        Transaction.objects.create(
            sender= admin,
            receiver=receiver,
            amount=amount,
            purpose="Deposit"
        )
        
        
        return Response(
            {"success":f"The amount ${amount} is Deposited successfully to {receiver_username}"},
            status=status.HTTP_200_OK
        )
        
        
def require_api_key(func):

    @functools.wraps(func)
    def wrapper(self,request,*args,**kwargs):

        key= request.headers.get("X-Api_Key")

        if not key or key != settings.STUDENT_APP_API_KEY:
            return Response(
                {"error":"UnAuthorize"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return func(self,request,*args,**kwargs)
    return wrapper


class ValidateUserView(APIView):
    authentication_classes= []
    permission_classes = []

    @require_api_key
    def get(self,request):

        name= request.query_params.get("username")

        if not name:
            return Response(
                {"error":"Please provide the Username"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_profile = User.objects.get(username=name)
        except User.DoesNotExist:
            return Response(
                {"error":"The User is not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {   "exists":True,
                "username":user_profile.username,
                "message":f"The user {user_profile.username} Exists",
             }
        )
    
class CreateFeeRequestView(APIView):

    authentication_classes= []
    permission_classes= []

    @require_api_key
    def post(self,request):

        username= request.data.get("username")
        amount= request.data.get("amount")
        student_name= request.data.get("student_name","")

        if not username or not amount:
            return Response (
                {"error":"Please Provide username or Amount"}
            )
        
        try:
            payer= User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error":"The user is not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            requester= User.objects.get(username=settings.UNIVERSITY_MICROFINANCE_USERNAME)
        except User.DoesNotExist:
            return Response(
                {"error":"The University Account not Found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        fee_request= Request.objects.create(
            requester=requester,
            payer=payer,
            amount= Decimal(str(amount)),
            purpose=f"University payment for Student: {student_name}",
            status="pending"
        )

        return Response({
            "request_id": str(fee_request.id),
            "status": fee_request.status,
            "amount": str(fee_request.amount),
            "payer": payer.username,
            "message": "Fee request created. Please approve it in the Microfinance app."
        }, status=status.HTTP_201_CREATED)
    
class FeeRequestStatusView(APIView):

    permission_classes= []
    authentication_classes= []

    @require_api_key
    def get(self,request,request_id):

        try:
            fee_request= Request.objects.get(id=request_id)
        except Request.DoesNotExist:
            return Response(
                {"error","Request not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            "request_id": str(fee_request.id),
            "status":fee_request.status,
        })