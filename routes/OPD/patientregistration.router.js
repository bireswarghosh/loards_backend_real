// backend/routes/OPD/patientregistration.router.js
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { 
  createPatientRegistrationController, 
  getAllPatientRegistrationsController, 
  getPatientRegistrationByIdController, 
  updatePatientRegistrationController, 
  deletePatientRegistrationController,
  searchPatientRegistrationsByPhoneController
} from '../../controllers/OPD/patientregistration.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

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

// Validation rules
const registrationValidationRules = [
  body('RegistrationId').notEmpty().withMessage('Registration ID is required'),
  body('PatientName').optional().isString().isLength({ max: 50 }).withMessage('Patient name max length is 50'),
  body('Add1').optional().isString().isLength({ max: 50 }).withMessage('Address 1 max length is 50'),
  body('Add2').optional().isString().isLength({ max: 50 }).withMessage('Address 2 max length is 50'),
  body('Add3').optional().isString().isLength({ max: 50 }).withMessage('Address 3 max length is 50'),
  body('Age').optional().isNumeric().withMessage('Age must be a number'),
  body('AgeType').optional().isString().isLength({ max: 1 }).withMessage('AgeType must be a single character'),
  body('Sex').optional().isString().isLength({ max: 1 }).withMessage('Sex must be a single character'),
  body('MStatus').optional().isString().isLength({ max: 1 }).withMessage('MStatus must be a single character'),
  body('PhoneNo').optional().isString().isLength({ max: 22 }).withMessage('Phone number max length is 22'),
  body('GurdianName').optional().isString().isLength({ max: 200 }).withMessage('Guardian name max length is 200'),
  body('EMailId').optional().isEmail().isLength({ max: 100 }).withMessage('Invalid email or max length is 100')
];

// Get all patient registrations with pagination
router.get('/patientregistration', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validate, getAllPatientRegistrationsController);

// Search patient registrations by phone
router.get('/patientregistration/search-by-phone', [
  query('phone').notEmpty().withMessage('Phone number is required')
    .isString().withMessage('Phone number must be a string')
], validate, searchPatientRegistrationsByPhoneController);

// Create patient registration
router.post('/patientregistration', registrationValidationRules, validate, createPatientRegistrationController);

// Get patient registration by ID
router.get('/patientregistration/:id', [
  param('id').notEmpty().withMessage('Registration ID is required')
], validate, getPatientRegistrationByIdController);

// Update patient registration
router.put('/patientregistration/:id', [
  param('id').notEmpty().withMessage('Registration ID is required'),
  ...registrationValidationRules.slice(1) // Skip RegistrationId validation for updates
], validate, updatePatientRegistrationController);

// Delete patient registration
router.delete('/patientregistration/:id', [
  param('id').notEmpty().withMessage('Registration ID is required')
], validate, deletePatientRegistrationController);

export default router;