from django.contrib.auth.models import AbstractUser
from  django.db import models
import uuid

class User(AbstractUser):
    
    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone= models.CharField(max_length=13,unique=True)
    active= models.BooleanField(default=True)
    created_at= models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self. username} - {self.email} - {self.phone}"
    