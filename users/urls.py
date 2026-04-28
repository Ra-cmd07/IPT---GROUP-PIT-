from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),
    path('users/register/', views.UserViewSet.as_view({'get': 'register', 'post': 'register'}), name='register'),
    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),
    path('users/profile/update/', views.UserViewSet.as_view({
        'get': 'profile_update',
        'put': 'profile_update',
        'patch': 'profile_update',
    }), name='profile-update'),
]
