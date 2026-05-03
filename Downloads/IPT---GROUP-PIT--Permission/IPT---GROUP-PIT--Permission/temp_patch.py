from pathlib import Path

base = Path('c:/Users/Windows 11/Downloads/IPT---GROUP-PIT--my-new-branch (1)/IPT---GROUP-PIT--my-new-branch')

files = {
    'users/views.py': (
        "    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='register')\n"
        "    def register(self, request):\n"
        "        \"\"\"Register a new user with profile information.\"\"\"\n"
        "        serializer = UserCreateSerializer(data=request.data)\n"
        "        if serializer.is_valid():\n"
        "            serializer.save()\n"
        "            return Response(\n"
        "                {'message': 'User created successfully'},\n"
        "                status=status.HTTP_201_CREATED\n"
        "            )\n"
        "        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)\n",
        "    @action(detail=False, methods=['get', 'post'], permission_classes=[AllowAny], serializer_class=UserCreateSerializer, url_path='register')\n"
        "    def register(self, request):\n"
        "        \"\"\"Register a new user with profile information.\"\"\"\n"
        "        if request.method == 'GET':\n"
        "            serializer = self.get_serializer()\n"
        "            return Response(serializer.data)\n\n"
        "        serializer = self.get_serializer(data=request.data)\n"
        "        if serializer.is_valid():\n"
        "            serializer.save()\n"
        "            return Response(\n"
        "                {'message': 'User created successfully'},\n"
        "                status=status.HTTP_201_CREATED\n"
        "            )\n"
        "        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)\n",
    ),
    'users/urls.py': (
        "urlpatterns = [\n"
        "    path('users/', views.UserViewSet.as_view({'post': 'register'}), name='register-root'),\n"
        "    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),\n"
        "    path('users/register/', views.UserViewSet.as_view({'post': 'register'}), name='register'),\n"
        "    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),\n"
        "    path('users/profile/update/', views.UserViewSet.as_view({'put': 'profile_update'}), name='profile-update'),\n"
        "]\n",
        "urlpatterns = [\n"
        "    path('users/', views.UserViewSet.as_view({'get': 'register', 'post': 'register'}), name='register-root'),\n"
        "    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),\n"
        "    path('users/register/', views.UserViewSet.as_view({'get': 'register', 'post': 'register'}), name='register'),\n"
        "    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),\n"
        "    path('users/profile/update/', views.UserViewSet.as_view({'put': 'profile_update'}), name='profile-update'),\n"
        "]\n",
    ),
}

for rel, (old, new) in files.items():
    path = base / rel
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Old text not found in {rel}')
    path.write_text(text.replace(old, new), encoding='utf-8')
print('patched')
