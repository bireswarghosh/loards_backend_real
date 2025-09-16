// middleware/path-checker.middleware.js
// This middleware checks the full URL path and sets flags for specific routes

export const pathCheckerMiddleware = (req, res, next) => {
  // Get the full URL path
  const fullPath = req.originalUrl || req.url;
  
  // Check for ambulance routes
  if (fullPath.includes('/ambulance')) {
    req.isAmbulanceRoute = true;
  }
  
  // Check for pickup routes
  if (fullPath.includes('/pickup')) {
    req.isPickupRoute = true;
  }
  
  // Check for nursing routes
  if (fullPath.includes('/nursing')) {
    req.isNursingRoute = true;
  }
  
  // Check for nursing booking routes
  if (fullPath.includes('/nursing-bookings')) {
    req.isNursingBookingRoute = true;
  }
  
  // Check for patient auth routes
  if (fullPath.includes('/patient-auth')) {
    req.isPatientAuthRoute = true;
  }
  
  next();
};