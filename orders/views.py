from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Order, OrderItem, MenuItem
from .serializers import OrderSerializer, OrderItemSerializer, MenuItemSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('created_at')
    serializer_class = OrderSerializer

    @action(detail=False, methods=['get'], url_path='queue')
    def queue(self, request):
        """Kitchen queue - pending and preparing orders, oldest first."""
        orders = Order.objects.filter(status__in=['pending', 'preparing']).order_by('created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update order status. Pass { "status": "completed" } etc."""
        order = self.get_object()
        new_status = request.data.get('status', order.status)
        order.status = new_status
        if new_status == 'completed':
            order.completed_at = timezone.now()
        order.save()
        return Response(OrderSerializer(order).data)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    @action(detail=True, methods=['patch'], url_path='cooking-status')
    def cooking_status(self, request, pk=None):
        """PATCH { "action": "start" | "finish" } to update cooking status."""
        item = self.get_object()
        act = request.data.get('action')
        if act == 'start':
            item.start_cooking()
            if item.order.status == 'pending':
                item.order.status = 'preparing'
                item.order.save()
        elif act == 'finish':
            item.finish_cooking()
        else:
            return Response({'error': 'action must be "start" or "finish"'}, status=400)
        return Response(OrderItemSerializer(item).data)
