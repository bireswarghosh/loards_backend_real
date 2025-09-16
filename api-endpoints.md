# API Endpoints Documentation

Base URL: `https://fdp20f53-3000.inc1.devtunnels.ms`

## Authentication Routes
- `/api/v1/auth/*` - Authentication endpoints

## OPD Management
- `/api/v1/zones/*` - Zone management
- `/api/v1/admissions/*` - Admission management  
- `/api/v1/religions/*` - Religion management
- `/api/v1/departments/*` - Department management
- `/api/v1/doctors/*` - Doctor management
- `/api/v1/doctormasters/*` - Doctor master data
- `/api/v1/subdepartments/*` - Sub-department management
- `/api/v1/specialities/*` - Medical speciality management
- `/api/v1/doctor-visit-days/*` - Doctor visit day management
- `/api/v1/bookings/*` - OPD booking management

## Hospital Management
- `/api/v1/hospital-registration/*` - Hospital registration
- `/api/v1/hospital-auth/*` - Hospital authentication

## Master Data Management
- `/api/V1/packages/*` - Package management
- `/api/V1/includes/*` - Package includes
- `/api/V1/parameters/*` - Parameter setup
- `/api/V1/department_groups/*` - Department groups
- `/api/V1/departmentIndoor/*` - Indoor department management

## Bed & Room Management
- `/api/v1/bedMaster/*` - Bed master data
- `/api/v1/dayCare/*` - Day care bed rates

## Operation Theater Management
- `/api/v1/otMaster/*` - O.T. master data
- `/api/v1/otSlot/*` - O.T. slot management
- `/api/v1/otType/*` - O.T. type management
- `/api/v1/otCategory/*` - O.T. category management
- `/api/v1/otItem/*` - O.T. item management

## Financial Management
- `/api/v1/cashless/*` - Cashless management
- `/api/v1/acHead/*` - Account head management
- `/api/v1/acGroup/*` - Account group management

## Patient Services (No Auth Required)
- `/api/v1/patient-auth/*` - Direct patient authentication
- `/api/v1/appointment-booking-app/*` - Appointment booking app

## Ambulance Services (No Auth Required)
- `/api/v1/ambulance/*` - Ambulance category management
- `/api/v1/pickup/*` - Ambulance booking requests
  - Example: `https://fdp20f53-3000.inc1.devtunnels.ms/api/v1/pickup/pickup-requests`

## Nursing Services (No Auth Required)
- `/api/v1/nursing/*` - Nursing care category
- `/api/v1/nursing-bookings/*` - Nursing booking management

## Appointment Management
- `/api/v1/appointments/*` - Appointment management from app

## Diagnostic Services
- `/api/v1/diagnostic/*` - Diagnostic booking
- `/api/v1/diagnostic/tests/*` - Test management

## Example URLs:
- Pickup Requests: `https://fdp20f53-3000.inc1.devtunnels.ms/api/v1/pickup/pickup-requests`
- Ambulance List: `https://fdp20f53-3000.inc1.devtunnels.ms/api/v1/ambulance/ambulance-list`
- Nursing Care: `https://fdp20f53-3000.inc1.devtunnels.ms/api/v1/nursing/nursing-care`
- Nursing Bookings: `https://fdp20f53-3000.inc1.devtunnels.ms/api/v1/nursing-bookings/*`