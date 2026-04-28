import os
import django
from django.urls import resolve

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchen_system.settings')
django.setup()

for path in ['/api/auth/users/', '/api/v1/auth/users/']:
    try:
        match = resolve(path)
        print('PATH', path)
        print(' func:', match.func)
        print(' module:', match.func.__module__)
        print(' kwargs:', match.kwargs)
        print(' args:', match.args)
    except Exception as e:
        print('PATH', path, 'ERROR', repr(e))
