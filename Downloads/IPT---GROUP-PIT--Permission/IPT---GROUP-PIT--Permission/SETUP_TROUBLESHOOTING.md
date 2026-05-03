# Setup & Troubleshooting Guide

## Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd /path/to/IPT---GROUP-PIT-

# Install authentication packages
pip install djoser djangorestframework-simplejwt
```

#### Apply Database Migrations
```bash
python manage.py makemigrations users  # Already done
python manage.py migrate users         # Apply to database
```

#### Create Superuser (for admin panel)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
# You can use the /admin/ panel to manage users
```

#### Run Django Server
```bash
python manage.py runserver
# Server runs on http://localhost:8000
```

### 2. Frontend Setup

#### Install Dependencies (if not already done)
```bash
cd frontend
npm install
```

#### Run Development Server
```bash
npm run dev
# Frontend runs on http://localhost:5173 (or similar)
```

### 3. Test the Flow

1. **Register**: Go to http://localhost:5173/register
2. **Create Account**: Fill in all fields and submit
3. **Login**: Navigate to http://localhost:5173/login
4. **View Profile**: After login, you're redirected to profile page
5. **Edit Profile**: Click "Edit Profile" to update information

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'rest_framework_simplejwt'"

**Solution**:
```bash
pip install djangorestframework-simplejwt djoser
```

### Issue: "Database connection failed"

**Error**: `SSL connection has been closed unexpectedly`

**Solutions**:

**Option 1: Use SQLite for Local Testing**
Edit `kitchen_system/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Option 2: Wait for Remote Database**
The remote PostgreSQL server may be temporarily down. Try again later.

**Option 3: Use Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database and update settings.py with local credentials
```

### Issue: Migration Not Applied

**Error**: `django.db.utils.ProgrammingError: relation "users_userprofile" does not exist`

**Solution**:
```bash
python manage.py migrate users
```

### Issue: "CORS errors - requests blocked"

**Already Fixed** in settings.py:
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

If still having issues, ensure:
- Backend server is running on `http://localhost:8000`
- Frontend is accessing correct API URL
- Browser console shows the actual error

### Issue: JWT Token Not Working

**Symptoms**:
- Profile page shows error "Failed to load profile"
- 401 Unauthorized errors

**Solutions**:

1. **Clear Cache and Tokens**:
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

2. **Check Token Storage**:
   ```javascript
   // In browser console
   console.log(localStorage.getItem('access_token'));
   console.log(localStorage.getItem('refresh_token'));
   ```

3. **Login Again**:
   - Navigate to `/login`
   - Enter credentials
   - Tokens automatically saved

### Issue: Login Fails with "Invalid Credentials"

**Check**:
1. Ensure user exists in database
2. Correct email (not username) for login
3. Correct password
4. User created successfully (check `python manage.py shell`):
   ```python
   from django.contrib.auth.models import User
   User.objects.all()
   ```

### Issue: Profile Page Loads But Shows No Data

**Check**:
1. User is authenticated (check localStorage for tokens)
2. Backend profile endpoint returns data
3. Test with curl:
   ```bash
   curl -X GET http://localhost:8000/api/users/users/profile/ \
     -H "Authorization: JWT your_token_here"
   ```

### Issue: "TypeError in Profile Component"

**Common Causes**:
- Profile data structure mismatch
- Missing profile relationship

**Solution**:
```bash
# Recreate userprofile for existing users
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from users.models import UserProfile
>>> for user in User.objects.all():
>>>     UserProfile.objects.get_or_create(user=user)
```

### Issue: Frontend Cannot Reach Backend

**Check**:
1. Backend running: `http://localhost:8000`
2. API_BASE in `frontend/src/api.ts` is correct
3. Network request in browser DevTools shows error
4. Try direct request in browser console:
   ```javascript
   fetch('http://localhost:8000/api/users/users/profile/')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

### Issue: "Password is required" error on registration

**Check**:
1. Password is at least 8 characters (default validation)
2. Password and password_confirm match
3. No special characters issues

**Adjust** in Django if needed (settings.py):
```python
AUTH_PASSWORD_VALIDATORS = [
    # Remove validators as needed for dev
]
```

---

## Useful Commands

### Django Management

```bash
# View all migrations
python manage.py showmigrations

# Apply specific migration
python manage.py migrate users

# Run SQL shell
python manage.py dbshell

# Run Python shell
python manage.py shell

# View all users
python manage.py shell
>>> from django.contrib.auth.models import User
>>> [u.email for u in User.objects.all()]
```

### Testing API with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123456","password_confirm":"Test123456","first_name":"Test"}'

# Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}' \
  | jq -r '.access')

# Get Profile
curl -X GET http://localhost:8000/api/users/users/profile/ \
  -H "Authorization: JWT $TOKEN"

# Update Profile
curl -X PUT http://localhost:8000/api/users/users/profile/update/ \
  -H "Authorization: JWT $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Updated","age":30}'
```

### Frontend Debugging

```javascript
// In browser console

// Check tokens
localStorage.getItem('access_token')
localStorage.getItem('refresh_token')

// Clear tokens
localStorage.clear()

// Check current API
console.log(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')

// Make test request
fetch('http://localhost:8000/api/users/users/profile/', {
  headers: {
    'Authorization': 'JWT ' + localStorage.getItem('access_token')
  }
}).then(r => r.json()).then(console.log)
```

---

## Port Information

| Service | URL | Port |
|---------|-----|------|
| Django Backend | http://localhost:8000 | 8000 |
| React Frontend | http://localhost:5173 | 5173 |
| PostgreSQL (Remote) | N/A | 5432 |
| SQLite (Local) | db.sqlite3 | N/A |

---

## Performance Notes

- JWT tokens cached in localStorage
- Profile queries cached automatically
- Token refresh only on 401 responses
- No unnecessary API calls in frontend

---

## Security Checklist

For **Development** ✅ (Current Setup):
- [x] CORS enabled
- [x] JWT tokens working
- [x] Authentication required for protected routes
- [x] Credentials stored in localStorage

For **Production** ⚠️ (TO DO):
- [ ] Change Django SECRET_KEY
- [ ] Set DEBUG = False
- [ ] Configure HTTPS/SSL
- [ ] Restrict CORS origins
- [ ] Use environment variables for secrets
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection
- [ ] Run security checks: `python manage.py check --deploy`

---

## Getting Help

If you encounter issues:
1. Check the error message carefully
2. Review AUTHENTICATION_GUIDE.md
3. Check API_REFERENCE.md for endpoint details
4. Test with cURL commands
5. Check browser DevTools Network tab
6. Look at Django console output for errors

## Files to Review

- **Setup**: `AUTHENTICATION_GUIDE.md`
- **API Details**: `API_REFERENCE.md`
- **What's Done**: `IMPLEMENTATION_SUMMARY.md`
- **Django Docs**: https://docs.djangoproject.com/
- **JWT Docs**: https://django-rest-framework-simplejwt.readthedocs.io/
- **Djoser Docs**: https://djoser.readthedocs.io/
