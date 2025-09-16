// backend/routes/OPD/outdoorbillmst.router.js
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { 
  createOutdoorBillController, 
  getAllOutdoorBillsController, 
  getOutdoorBillByIdController, 
  updateOutdoorBillController, 
  deleteOutdoorBillController,
  searchOutdoorBillsByRegistrationController,
  searchOutdoorBillsByDateController
} from '../../controllers/OPD/outdoorbillmst.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

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

// Validation rules
const billValidationRules = [
  body('OutBillId').notEmpty().withMessage('OutBillId is required'),
  body('RegistrationId').optional().isString().isLength({ max: 20 }).withMessage('RegistrationId max length is 20'),
  body('OutBillNo').optional().isString().isLength({ max: 30 }).withMessage('OutBillNo max length is 30'),
  body('OutBillDate').optional().isISO8601().withMessage('Invalid OutBillDate format'),
  body('Amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('UserId').optional().isInt().withMessage('UserId must be an integer'),
  body('DoctorId').optional().isInt().withMessage('DoctorId must be an integer'),
  body('DiscAmt').optional().isNumeric().withMessage('DiscAmt must be a number'),
  body('GTotal').optional().isNumeric().withMessage('GTotal must be a number'),
  body('paidamt').optional().isNumeric().withMessage('paidamt must be a number'),
  body('dueamt').optional().isNumeric().withMessage('dueamt must be a number'),
  body('PaymentType').optional().isInt().withMessage('PaymentType must be an integer'),
  body('BANK').optional().isString().isLength({ max: 70 }).withMessage('BANK max length is 70'),
  body('Cheque').optional().isString().isLength({ max: 25 }).withMessage('Cheque max length is 25'),
  body('narration').optional().isString().isLength({ max: 250 }).withMessage('narration max length is 250')
];

// Get all outdoor bills with pagination
router.get('/outdoorbillmst', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validate, getAllOutdoorBillsController);

// Search by registration ID
router.get('/outdoorbillmst/search-by-registration', [
  query('registrationId').notEmpty().withMessage('Registration ID is required')
], validate, searchOutdoorBillsByRegistrationController);

// Search by date range
router.get('/outdoorbillmst/search-by-date', [
  query('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
  query('endDate').notEmpty().isISO8601().withMessage('Valid end date is required')
], validate, searchOutdoorBillsByDateController);

// Create outdoor bill
router.post('/outdoorbillmst', billValidationRules, validate, createOutdoorBillController);

// Get outdoor bill by ID
router.get('/outdoorbillmst/:id', [
  param('id').notEmpty().withMessage('OutBillId is required')
], validate, getOutdoorBillByIdController);

// Update outdoor bill
router.put('/outdoorbillmst/:id', [
  param('id').notEmpty().withMessage('OutBillId is required'),
  ...billValidationRules.slice(1) // Skip OutBillId validation for updates
], validate, updateOutdoorBillController);

// Delete outdoor bill
router.delete('/outdoorbillmst/:id', [
  param('id').notEmpty().withMessage('OutBillId is required')
], validate, deleteOutdoorBillController);

export default router;