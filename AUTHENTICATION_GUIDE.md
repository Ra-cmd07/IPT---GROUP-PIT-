# Authentication System Implementation Guide

## Overview
A complete JWT-based authentication system with user profile management has been implemented for your Kitchen Queue application.

## Backend (Django)

### 1. Users App Created
- **Location**: `/users/` directory
- **Files**: models.py, views.py, serializers.py, urls.py, signals.py, admin.py

### 2. Database Models
**UserProfile Model** (`users/models.py`):
- One-to-one relationship with Django's User model
- Fields:
  - `address`: CharField (max 255 characters)
  - `age`: PositiveIntegerField (optional)
  - `birthday`: DateField (optional)
  - `created_at`: Auto-timestamps
  - `updated_at`: Auto-timestamps

### 3. API Endpoints

#### Authentication Endpoints (via Djoser)
- `POST /api/auth/jwt/create/` - Login (email/password)
- `POST /api/auth/jwt/refresh/` - Refresh token
- `POST /api/auth/users/register/` - Register new user

#### User Profile Endpoints
- `GET /api/users/users/profile/` - Get current user profile (requires authentication)
- `PUT /api/users/users/profile/update/` - Update user profile (requires authentication)

### 4. Settings Configuration (`kitchen_system/settings.py`)
```python
INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt',
    'djoser',
    'users',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

### 5. URL Routing (`kitchen_system/urls.py`)
```python
urlpatterns = [
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/', include('users.urls')),
]
```

### 6. Database Migration
Migration file created: `users/migrations/0001_initial.py`

**To apply migrations:**
```bash
python manage.py migrate users
```

---

## Frontend (React/TypeScript)

### 1. New Components Created

#### Login Component (`frontend/src/components/Login.tsx`)
- Email and password input fields
- Error handling and loading states
- Redirects to profile on successful login
- Link to registration page
- Styled with consistent UI design

#### Register Component (`frontend/src/components/Register.tsx`)
- User registration form with:
  - Username, email, password confirmation
  - First name, last name
  - Optional fields: address, age, birthday
- Form validation
- Error handling
- Redirects to login after successful registration

#### Profile Component (`frontend/src/components/Profile.tsx`)
- Display current user information:
  - Username, email, first name, last name
  - Address, age, birthday (from UserProfile)
- Edit mode to update profile
- Profile save functionality
- Logout button
- Loading states and error handling

#### ProtectedRoute Component (`frontend/src/components/ProtectedRoute.tsx`)
- Guards routes that require authentication
- Redirects unauthenticated users to login

### 2. API Integration (`frontend/src/api.ts`)
Extended with authentication functions:
```typescript
export const login = async (email: string, password: string)
export const register = async (userData: any)
export const getProfile = () => apiCall(ENDPOINTS.auth.profile)
export const updateProfile = (data: any)
export const logout = ()
export const isAuthenticated = () => !!localStorage.getItem('access_token')
```

**Features:**
- Automatic JWT token attachment to requests
- Token refresh on 401 responses
- LocalStorage-based token persistence

### 3. Updated App Component (`frontend/src/App.tsx`)
- Conditional navigation bar (hidden on login/register pages)
- Protected routes for kitchen operations
- New routes:
  - `/login` - Login page
  - `/register` - Registration page
  - `/profile` - User profile (protected)
- Home page shows login/register options when unauthenticated
- Redirects authenticated users to profile

## Workflow

### Registration Flow
1. User navigates to `/register`
2. Fills in registration form with required info
3. Submits form
4. Backend creates User and UserProfile
5. Redirects to login page
6. User logs in

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Backend validates and returns JWT tokens
4. Tokens stored in localStorage
5. Redirects to `/profile`

### Profile Access Flow
1. Authenticated requests include JWT token in header: `Authorization: JWT <token>`
2. Protected routes check authentication before rendering
3. Profile page displays user details and UserProfile info
4. User can edit and update profile information

### Token Refresh Flow
1. If access token expires (401 response)
2. System uses refresh token to get new access token
3. Retries original request with new token
4. User unaware of token refresh

## Setup Instructions

### Backend Setup
1. Install required packages:
   ```bash
   pip install djoser djangorestframework-simplejwt
   ```

2. Apply migrations:
   ```bash
   python manage.py makemigrations users
   python manage.py migrate users
   ```

3. Create superuser for admin panel:
   ```bash
   python manage.py createsuperuser
   ```

4. Run development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. React components already created and integrated
2. No additional package installation needed (uses existing dependencies)
3. Run development server:
   ```bash
   npm run dev
   ```

## Environment & Configuration

### Key Environment Variables (if needed)
- `API_BASE`: Default is `http://localhost:8000/api`

### CORS Configuration
Already enabled in settings.py:
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

## Security Notes

⚠️ **Important for Production:**
1. Never commit credentials/secret keys
2. Change `SECRET_KEY` in settings.py
3. Set `DEBUG = False` in production
4. Implement HTTPS
5. Add CSRF protection configuration
6. Use environment variables for sensitive data
7. Implement proper CORS restrictions

## Testing

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Profile Access
```bash
curl -X GET http://localhost:8000/api/users/users/profile/ \
  -H "Authorization: JWT <your_access_token>"
```

## Additional Features Supported

1. **Password Validation**: Django's built-in validators enforced
2. **User Admin Panel**: UserProfile registered in Django admin
3. **Signal Handlers**: Auto-create UserProfile when User created
4. **Pagination**: Orders and menu items support pagination
5. **Token Expiration**: 60-minute access, 1-day refresh tokens

## Troubleshooting

### Database Connection Issues
If you see PostgreSQL SSL errors, the remote database may be temporarily unavailable. For local development, you can use SQLite by updating `DATABASES` in settings.py.

### Token Expiration
Tokens automatically refresh when expired. If issues persist, clear localStorage and log in again.

### CORS Errors
Ensure frontend runs on development server and backend CORS settings are correct.
