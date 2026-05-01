from django.contrib.auth.models import AbstractUser
from  django.db import models
import uuid
import random
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    
    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone= models.CharField(max_length=13,unique=True)

   
    def __str__(self):
        return f"{self. username} - {self.email} - {self.phone}"
    

class OTPVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='otp')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.code}"

    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))

    @property
    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)
    

