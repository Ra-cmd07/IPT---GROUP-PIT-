import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchen_system.settings')
import django
django.setup()
import inspect
from djoser.serializers import UserCreateSerializer
print(inspect.getsource(UserCreateSerializer))
