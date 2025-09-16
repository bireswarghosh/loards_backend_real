import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { 
  getAllDoctorVisitsController,
  getDoctorVisitByIdController,
  getDoctorVisitsByAdmissionController,
  createDoctorVisitController,
  updateDoctorVisitController,
  deleteDoctorVisitController
} from '../../controllers/OPD/doctorvisit.controller.js';
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

// Define validation rules for doctor visit fields
const doctorVisitValidationRules = [
  // String fields
  body('DoctorVisitId').optional().isString().isLength({ max: 20 }).withMessage('DoctorVisitId must be a string (max 20 chars)'),
  body('AdmitionId').optional().isString().isLength({ max: 20 }).withMessage('AdmitionId must be a string (max 20 chars)'),
  body('VisitTime').optional().isString().isLength({ max: 10 }).withMessage('VisitTime must be a string (max 10 chars)'),
  body('TypeOfVisit').optional().isString().isLength({ max: 30 }).withMessage('TypeOfVisit must be a string (max 30 chars)'),
  body('Adv1').optional({ nullable: true }).isString().withMessage('Adv1 must be a string'),
  body('Adv2').optional({ nullable: true }).isString().withMessage('Adv2 must be a string'),
  body('Clearing').optional().isString().isLength({ max: 1 }).withMessage('Clearing must be a single character'),
  body('VUNIT').optional().isString().isLength({ max: 10 }).withMessage('VUNIT must be a string (max 10 chars)'),
  body('cashno').optional({ nullable: true }).isString().isLength({ max: 20 }).withMessage('cashno must be a string (max 20 chars)'),
  body('Package').optional().isString().isLength({ max: 1 }).withMessage('Package must be a single character'),
  
  // Numeric fields
  body('DoctorId').optional().isInt().withMessage('DoctorId must be an integer'),
  body('Rate').optional().isNumeric().withMessage('Rate must be a number'),
  body('UserId').optional().isInt().withMessage('UserId must be an integer'),
  body('NoOfVisit').optional().isInt().withMessage('NoOfVisit must be an integer'),
  body('Amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('payAmount').optional().isNumeric().withMessage('payAmount must be a number'),
  body('paidAmount').optional().isNumeric().withMessage('paidAmount must be a number'),
  
  // Date fields
  body('VisitDate').optional().isISO8601().withMessage('VisitDate must be a valid date'),
  body('paiddate').optional().isISO8601().withMessage('paiddate must be a valid date')
];

// IMPORTANT: Route order matters! More specific routes must come before generic ones

// Get doctor visits by admission ID
router.get('/doctorvisit/admission/:prefix/:suffix', [
  param('prefix').isString().withMessage('prefix must be a string'),
  param('suffix').isString().withMessage('suffix must be a string'),
  validate
], (req, res) => {
  req.params.admissionId = `${req.params.prefix}/${req.params.suffix}`;
  getDoctorVisitsByAdmissionController(req, res);
});

// Create new doctor visit for specific admission
router.post('/doctorvisit/admission/:prefix/:suffix', (req, res) => {
  req.body.AdmitionId = `${req.params.prefix}/${req.params.suffix}`;
  createDoctorVisitController(req, res);
});

// Get all doctor visits
router.get('/doctorvisit', [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  query('admissionId').optional().isString().withMessage('admissionId must be a string'),
  validate
], getAllDoctorVisitsController);

// Create new doctor visit
router.post('/doctorvisit', createDoctorVisitController);

// Get doctor visit by ID
router.get('/doctorvisit/:prefix/:suffix', [
  param('prefix').isString().withMessage('prefix must be a string'),
  param('suffix').isString().withMessage('suffix must be a string'),
  validate
], (req, res) => {
  req.params.id = `${req.params.prefix}/${req.params.suffix}`;
  getDoctorVisitByIdController(req, res);
});

// Update doctor visit
router.put('/doctorvisit/:prefix/:suffix', (req, res) => {
  req.params.id = `${req.params.prefix}/${req.params.suffix}`;
  updateDoctorVisitController(req, res);
});

// Delete doctor visit
router.delete('/doctorvisit/:prefix/:suffix', [
  param('prefix').isString().withMessage('prefix must be a string'),
  param('suffix').isString().withMessage('suffix must be a string'),
  validate
], (req, res) => {
  req.params.id = `${req.params.prefix}/${req.params.suffix}`;
  deleteDoctorVisitController(req, res);
});

export default router;