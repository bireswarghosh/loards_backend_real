# Authentication Implementation

## How to use the authentication system:

### 1. Login (Get Token)
```javascript
// POST /api/v1/patient-auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

// Response:
{
  "message": "Signin successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "patient": {
    "id": 1,
    "fullName": "John Doe",
    "email": "user@example.com",
    // ... other patient data
  }
}
```

### 2. Use Token in API Calls
```javascript
// Add token to Authorization header
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

### 3. Protected Routes
All these routes now require authentication token:
- `/api/v1/appointment-booking-app/*`
- `/api/v1/ambulance/*`
- `/api/v1/pickup/*`
- `/api/v1/nursing/*`
- `/api/v1/nursing-bookings/*`
- `/api/v1/appointments/*`
- `/api/v1/diagnostic/*`
- `/api/v1/health-packages/*`
- `/api/v1/prescription-delivery/*`
- Generic medicine routes

### 4. Frontend Example
```javascript
// Store token after login
localStorage.setItem('authToken', response.data.token);

// Use token in API calls
const token = localStorage.getItem('authToken');
const response = await fetch('/api/v1/appointments', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 5. Token Expiry
- Token expires in 24 hours
- User needs to login again after expiry
- Frontend should handle 401 responses and redirect to login