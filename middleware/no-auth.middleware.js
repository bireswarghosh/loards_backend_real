// middleware/no-auth.middleware.js
// This middleware bypasses authentication for specific routes

export const noAuthMiddleware = (req, res, next) => {
  // Simply pass to the next middleware/route handler
  next();
};