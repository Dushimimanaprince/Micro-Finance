from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username','email','phone','is_active','date_joined')
    search_fields= ("username","email","phone")
    fieldsets= UserAdmin.fieldsets + (
        ("Extra Info" , {"fields":("phone",)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('phone',)}),
    )
