from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import RegisterSerializer
from .serializer import RegisterSerializer,CustomTokenObtainPairSerializer
from .models import OTPVerification
from accounts.utils import send_otp_email

User= get_user_model()

class RegisterView(APIView):
    permission_classes= [AllowAny]
    
    def post(self,request):
        
        serializer= RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user= serializer.save()
            user.is_active = False
            user.save()
            
            code= OTPVerification.generate_code()
            OTPVerification.objects.create(
                user=user, code=code
            )
            
            send_otp_email(user,code)
            
            return Response(
                {"message":"Account Created Successfully, Check your email for the verification code."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class VerifyOTPView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self,request):
        
        email= request.data.get("email")
        code= request.data.get("code")
        
        if not email or not code:
            return Response(
                {"error":"Please provide the Email or OTP Code"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user= User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error":"The user can't be found with such Email"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            otp= OTPVerification.objects.get(user=user,code=code)
        except OTPVerification.DoesNotExist:
            return Response(
                {"error":"The OTP Code is Invalid"}
            )
        
        if otp.is_used == True:
            return Response(
                {"error":"The OTP Code has been already used"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if otp.is_expired:
            return Response(
                {"error":"The OTP Code is expired Please request Another"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_active = True
        user.save()
        
        otp.is_used = True
        otp.save()
        
        return Response(
            {"message": "Account verified successfully. You can now login."},
            status=status.HTTP_200_OK
        )
               
    
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


