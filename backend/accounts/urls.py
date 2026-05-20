from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, VerifyOTPView, ResendOTPView,MeView,UsersView
from accounts.views import UsersSuperuserSet, UsersToggleView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('auth/resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('auth/me/', MeView.as_view(),name='me'),
    path('users/', UsersView.as_view(),name='users'),
    path('users/<uuid:id>/', UsersView.as_view(),name='user-edit'),
    path('users/toggle/<uuid:id>/', UsersToggleView.as_view(),name='users-toggle'),
    path('users/set/<uuid:id>/', UsersSuperuserSet.as_view(),name='users-toggle'),
]