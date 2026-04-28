from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone= models.CharField(max_length=12,unique=True)
    is_active= models.BooleanField(default=True)
    create_at= models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} | {self.email} {self.phone}"