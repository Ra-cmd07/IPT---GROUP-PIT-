import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'kitchen_system.settings'
import django
django.setup()
from users.serializers import UserCreateSerializer

data = {
    'name': 'John Doe',
    'email': 'testuser@example.com',
    'password': 'TestPass123',
    're_password': 'TestPass123',
}
serializer = UserCreateSerializer(data=data)
print('is_valid', serializer.is_valid())
print('errors', serializer.errors)
print('validated', getattr(serializer, 'validated_data', None))
if serializer.is_valid():
    try:
        user = serializer.save()
        print('created', user.username)
    except Exception:
        import traceback
        traceback.print_exc()
