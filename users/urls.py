from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),
    path('users/register/', views.UserViewSet.as_view({'post': 'register'}), name='register'),
    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),
    path('users/profile/update/', views.UserViewSet.as_view({'put': 'profile_update'}), name='profile-update'),
]
