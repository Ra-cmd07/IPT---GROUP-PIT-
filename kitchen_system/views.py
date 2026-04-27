from django.http import JsonResponse


def api_root(request):
    """Root endpoint providing API documentation"""
    return JsonResponse({
        "message": "Welcome to Kitchen Queue API",
        "version": "1.0.0",
        "endpoints": {
            "auth": {
                "login": "/api/auth/users/login/",
                "register": "/api/auth/users/register/",
                "refresh": "/api/auth/jwt/refresh/"
            },
            "profile": {
                "get": "/api/auth/users/profile/",
                "update": "/api/auth/users/profile/update/"
            },
            "orders": "/api/orders/",
            "menu": "/api/menu/",
            "admin": "/admin/"
        },
        "documentation": {
            "guides": "See AUTHENTICATION_GUIDE.md and API_REFERENCE.md"
        }
    })
