// Dummy auth middleware - no authentication
export const authMiddleware = (req, res, next) => {
  next();
};