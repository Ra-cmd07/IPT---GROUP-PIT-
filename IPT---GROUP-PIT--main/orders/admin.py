from django.contrib import admin
from .models import Order, OrderItem, MenuItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('started_cooking_at', 'finished_cooking_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'table_number', 'status', 'total_price', 'created_at', 'completed_at')
    list_filter = ('status',)
    search_fields = ('table_number',)
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    inlines = [OrderItemInline]


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'estimated_prep_time', 'is_available')
    list_filter = ('category', 'is_available')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'menu_item', 'quantity', 'cooking_status', 'subtotal')
    list_filter = ('cooking_status',)
