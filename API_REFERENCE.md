# Quick Reference: Authentication & Profile API

## Base URL
```
http://localhost:8000/api
```

## Authentication Endpoints

### Register New User
```
POST /auth/users/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St, City",
  "age": 28,
  "birthday": "1996-04-20"
}

Response (201 Created):
{
  "message": "User created successfully"
}
```

### Login (Get JWT Token)
```
POST /auth/jwt/create/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Store both tokens in localStorage:
- localStorage.setItem('access_token', access_token)
- localStorage.setItem('refresh_token', refresh_token)
```

### Refresh Access Token
```
POST /auth/jwt/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response (200 OK):
{
  "access": "new_access_token_here"
}
```

## Profile Endpoints (Require Authentication)

### Get Current User Profile
```
GET /users/users/profile/
Authorization: JWT <access_token>

Response (200 OK):
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile": {
    "address": "123 Main St, City",
    "age": 28,
    "birthday": "1996-04-20"
  }
}
```

### Update User Profile
```
PUT /users/users/profile/update/
Authorization: JWT <access_token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "address": "456 New Ave, City",
  "age": 29,
  "birthday": "1995-04-20"
}

Response (200 OK):
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "newemail@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile": {
      "address": "456 New Ave, City",
      "age": 29,
      "birthday": "1995-04-20"
    }
  }
}
```

## Frontend Routes

- `GET /login` - Login page
- `GET /register` - Registration page
- `GET /profile` - User profile page (protected)
- `GET /create-order` - Create order (protected)
- `GET /kitchen-queue` - View order queue (protected)
- `GET /menu-admin` - Menu management (protected)

## cURL Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "password_confirm": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:8000/api/users/users/profile/ \
  -H "Authorization: JWT your_access_token_here"
```

### Update Profile
```bash
curl -X PUT http://localhost:8000/api/users/users/profile/update/ \
  -H "Authorization: JWT your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name",
    "address": "New Address",
    "age": 30,
    "birthday": "1995-01-01"
  }'
```

## Error Responses

### Invalid Credentials
```
401 Unauthorized
{
  "detail": "Invalid credentials"
}
```

### Missing Token
```
401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}
```

### Invalid Token
```
401 Unauthorized
{
  "detail": "Given token not valid for any token type"
}
```

### Validation Error
```
400 Bad Request
{
  "field_name": ["Error message"],
  "password": ["Passwords do not match."]
}
```

## Token Storage

**In Browser (localStorage)**:
```javascript
// After successful login
localStorage.setItem('access_token', response.access);
localStorage.setItem('refresh_token', response.refresh);

// For all authenticated requests
const token = localStorage.getItem('access_token');
headers['Authorization'] = `JWT ${token}`;

// On logout
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error |
