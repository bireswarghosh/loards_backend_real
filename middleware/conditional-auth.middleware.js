// middleware/conditional-auth.middleware.js
import jwt from 'jsonwebtoken';

export const conditionalAuthMiddleware = (req, res, next) => {
  // List of paths that don't require authentication
  const publicPaths = [
    '/api/v1/patient-auth/signup',
    '/api/v1/patient-auth/signin'
  ];
  
  // Check if the current path is in the public paths list
  if (publicPaths.includes(req.path)) {
    return next();
  }
  
  // For all other paths, require authentication
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};