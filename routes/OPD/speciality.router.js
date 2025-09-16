import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
  getAllSpecialitiesController, 
  getSpecialityByIdController, 
  createSpecialityController, 
  updateSpecialityController, 
  deleteSpecialityController 
} from '../../controllers/OPD/speciality.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Apply rate limiting for security
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Apply middleware to protect all routes
router.use(authMiddleware);
router.use(apiLimiter);

// Custom error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation error',
      errors: errors.array() 
    });
  }
  next();
};

// Define validation rules
const specialityValidationRules = [
  body('Speciality').trim().isLength({ min: 1, max: 50 }).withMessage('Speciality name is required (max 50 chars)'),
  body('Code').optional().isLength({ max: 3 }).withMessage('Code must be max 3 characters'),
  body('OT').optional().isLength({ max: 1 }).withMessage('OT must be a single character')
];

// Get all specialities
router.get('/speciality', getAllSpecialitiesController);

// Get speciality by ID
router.get('/speciality/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  validate
], getSpecialityByIdController);

// Create new speciality
router.post('/speciality', [
  ...specialityValidationRules,
  validate
], createSpecialityController);

// Update speciality
router.put('/speciality/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  ...specialityValidationRules,
  validate
], updateSpecialityController);

// Delete speciality
router.delete('/speciality/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  validate
], deleteSpecialityController);

export default router;