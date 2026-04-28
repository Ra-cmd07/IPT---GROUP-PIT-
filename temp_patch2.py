from pathlib import Path

base = Path('c:/Users/Windows 11/Downloads/IPT---GROUP-PIT--my-new-branch (1)/IPT---GROUP-PIT--my-new-branch')
path = base / 'users' / 'urls.py'
text = path.read_text(encoding='utf-8')
old = "urlpatterns = [\n    path('users/', views.UserViewSet.as_view({'post': 'register'}), name='register-root'),\n    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),\n    path('users/register/', views.UserViewSet.as_view({'post': 'register'}), name='register'),\n    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),\n    path('users/profile/update/', views.UserViewSet.as_view({'put': 'profile_update'}), name='profile-update'),\n]\n"
new = "urlpatterns = [\n    path('users/', views.UserViewSet.as_view({'get': 'register', 'post': 'register'}), name='register-root'),\n    path('users/login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),\n    path('users/register/', views.UserViewSet.as_view({'get': 'register', 'post': 'register'}), name='register'),\n    path('users/profile/', views.UserViewSet.as_view({'get': 'profile'}), name='profile'),\n    path('users/profile/update/', views.UserViewSet.as_view({'put': 'profile_update'}), name='profile-update'),\n]\n"
if old not in text:
    raise SystemExit('Expected exact users.urls content not found')
path.write_text(text.replace(old, new), encoding='utf-8')
print('patched urls')
