from django.db import models
from django.utils import timezone


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    table_number = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Order #{self.id} - Table {self.table_number} [{self.status}]"

    def mark_completed(self):
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()

    @property
    def preparation_time(self):
        """Returns preparation time in seconds if completed."""
        if self.completed_at:
            return (self.completed_at - self.created_at).seconds
        return None

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())
        

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('starter', 'Starter'),
        ('main', 'Main Course'),
        ('dessert', 'Dessert'),
        ('drink', 'Drink'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_prep_time = models.PositiveIntegerField(help_text="Estimated prep time in minutes")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (${self.price})"


class OrderItem(models.Model):
    COOKING_STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('cooking', 'Cooking'),
        ('done', 'Done'),
    ]

    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    cooking_status = models.CharField(max_length=10, choices=COOKING_STATUS_CHOICES, default='queued')
    special_instructions = models.CharField(max_length=255, blank=True)
    started_cooking_at = models.DateTimeField(null=True, blank=True)
    finished_cooking_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (Order #{self.order.id})"

    @property
    def subtotal(self):
        return self.menu_item.price * self.quantity

    def start_cooking(self):
        self.cooking_status = 'cooking'
        self.started_cooking_at = timezone.now()
        self.save()

    def finish_cooking(self):
        self.cooking_status = 'done'
        self.finished_cooking_at = timezone.now()
        self.save()
        # Auto-update order status if all items are done
        order = self.order
        if all(item.cooking_status == 'done' for item in order.items.all()):
            order.status = 'ready'
            order.save()
