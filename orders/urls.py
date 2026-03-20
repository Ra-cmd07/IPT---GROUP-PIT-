from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'menu', views.MenuItemViewSet, basename='menu')
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'order-items', views.OrderItemViewSet, basename='order-items')

urlpatterns = [
    path('', include(router.urls)),
]
