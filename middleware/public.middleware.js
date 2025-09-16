// middleware/public.middleware.js
// This middleware is a pass-through that doesn't require authentication

export const publicMiddleware = (req, res, next) => {
  // Simply pass to the next middleware/route handler
  next();
};