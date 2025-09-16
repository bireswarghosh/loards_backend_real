// backend/routes/OPD/patient-with-bills.router.js
import express from 'express';
import { param, query, validationResult } from 'express-validator';
import { 
  getPatientWithBillsController,
  getAllPatientsWithBillSummaryController,
  searchPatientsByPhoneWithBillsController
} from '../../controllers/OPD/patient-with-bills.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { patientDataRateLimit, searchRateLimit } from '../../middleware/patient-rate-limit.middleware.js';

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// Validation handler
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

// Get all patients with bill summary (paginated)
router.get('/patient-with-bills', patientDataRateLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('phone').optional().isString().withMessage('Phone must be a string'),
  query('date').optional().isISO8601().withMessage('Date must be in ISO format')
], validate, getAllPatientsWithBillSummaryController);

// Search patients by phone with bills
router.get('/patients-with-bills/search-by-phone', searchRateLimit, [
  query('phone').notEmpty().withMessage('Phone number is required')
    .isString().withMessage('Phone number must be a string')
], validate, searchPatientsByPhoneWithBillsController);

// Search patients by registration ID
router.get('/patient-with-bills/search-by-registration', searchRateLimit, [
  query('registrationId').notEmpty().withMessage('Registration ID is required')
    .isString().withMessage('Registration ID must be a string')
], validate, getPatientWithBillsController);

// Get specific patient with all bills
router.get('/patients-with-bills/:registrationId', [
  param('registrationId').notEmpty().withMessage('Registration ID is required')
], validate, getPatientWithBillsController);

export default router;