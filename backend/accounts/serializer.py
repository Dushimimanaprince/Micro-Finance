from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User= get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    
    class Meta:
        model= User
        fields=("username","first_name","last_name","email","phone","password")
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
    
        token['username']=user.username
        token['is_superuser']=user.is_superuser
        
        return token
        