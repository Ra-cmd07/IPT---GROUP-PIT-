from django.http import JsonResponse


def api_root(request):
    """Root endpoint providing API documentation"""
    return JsonResponse({
        "message": "Welcome to Kitchen Queue API",
        "version": "1.0.0",
        "endpoints": {
            "auth": {
                "register": "/api/auth/users/register/",
                "login": "/api/auth/jwt/create/",
                "refresh": "/api/auth/jwt/refresh/"
            },
            "profile": {
                "get": "/api/users/users/profile/",
                "update": "/api/users/users/profile/update/"
            },
            "orders": "/api/orders/",
            "menu": "/api/menu/",
            "admin": "/admin/"
        },
        "documentation": {
            "guides": "See AUTHENTICATION_GUIDE.md and API_REFERENCE.md"
        }
    })
