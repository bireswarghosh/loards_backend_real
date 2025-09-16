# Authentication System Summary

## Two Separate Authentication Systems:

### 1. Admin Authentication
**Login API:** `POST /api/v1/auth/login`
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "userId": 123,
  "token": "admin_jwt_token_here"
}
```

**Protected Admin Routes:** (Require Admin Token)
- All `/api/v1/*` routes except `/api/v1/auth/login` and `/api/v1/hospital-auth`
- Use header: `Authorization: Bearer <admin_token>`

### 2. Patient Authentication  
**Login API:** `POST /api/v1/patient-auth/signin`
```json
{
  "email": "patient@email.com", 
  "password": "patient_password"
}
```
**Response:**
```json
{
  "message": "Signin successful",
  "token": "patient_jwt_token_here",
  "patient": { ... }
}
```

**Protected Patient Routes:** (Require Patient Token)
- `/api/v1/appointment-booking-app/*`
- `/api/v1/ambulance/*`
- `/api/v1/pickup/*`
- `/api/v1/nursing/*`
- `/api/v1/nursing-bookings/*`
- `/api/v1/appointments/*`
- `/api/v1/diagnostic/*`
- `/api/v1/health-packages/*`
- `/api/v1/prescription-delivery/*`
- `/api/v1/generic-medicine/*`
- Use header: `Authorization: Bearer <patient_token>`

## No Auth Required:
- `/api/v1/auth/login` (Admin login)
- `/api/v1/patient-auth/*` (Patient auth routes)
- `/api/v1/hospital-auth/*` (Hospital auth routes)