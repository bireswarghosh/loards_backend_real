import rateLimit from 'express-rate-limit';

// Specific rate limiter for patient data endpoints
export const patientDataRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 300, // Allow 300 requests per minute per IP
  message: {
    success: false,
    message: 'Too many patient data requests. Please wait a moment before trying again.',
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for certain conditions
  skip: (req) => {
    // Skip rate limiting for internal requests or specific user agents
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
  // Custom key generator to handle different scenarios
  keyGenerator: (req) => {
    // Use IP + user agent for better rate limiting
    return `${req.ip}-${req.get('User-Agent') || 'unknown'}`;
  }
});

// Lighter rate limiter for search endpoints
export const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 searches per minute
  message: {
    success: false,
    message: 'Too many search requests. Please wait before searching again.',
    retryAfter: 60
  }
});