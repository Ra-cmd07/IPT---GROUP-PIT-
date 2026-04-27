from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Order, OrderItem, MenuItem
from .serializers import OrderSerializer, OrderItemSerializer, MenuItemSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        availability = self.request.query_params.get('available')
        if availability == 'true':
            return queryset.filter(is_available=True)
        if availability == 'false':
            return queryset.filter(is_available=False)
        return queryset

    @action(detail=True, methods=['patch'], url_path='toggle-availability')
    def toggle_availability(self, request, pk=None):
        item = self.get_object()
        if 'is_available' in request.data:
            item.is_available = bool(request.data.get('is_available'))
        else:
            item.is_available = not item.is_available
        item.save()
        return Response(MenuItemSerializer(item).data)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        """Create order with items. Expects: { "table_number": 1, "items": [{"id": 1, "quantity": 2}], "notes": "" }"""
        items_data = request.data.pop('items', [])
        table_number = request.data.get('table_number', 1)
        
        # Create the order
        order = Order.objects.create(
            table_number=table_number,
            notes=request.data.get('notes', ''),
        )
        
        # Create order items
        for item_data in items_data:
            try:
                menu_item = MenuItem.objects.get(id=item_data['id'])
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item_data.get('quantity', 1),
                    special_instructions=item_data.get('instructions', ''),
                )
            except MenuItem.DoesNotExist:
                order.delete()
                return Response(
                    {'error': f'MenuItem with id {item_data["id"]} not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
