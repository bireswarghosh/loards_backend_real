import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { 
  getAllDoctorsController, 
  getDoctorByIdController, 
  getDoctorsByDepartmentController,
  createDoctorController, 
  updateDoctorController, 
  deleteDoctorController 
} from '../../controllers/OPD/doctor.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

// Custom error handler with detailed validation errors
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

// Get all doctors with pagination and search
router.get('/doctor', [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  query('search').optional().isString().withMessage('Search must be a string'),
  validate
], getAllDoctorsController);

// Get doctor by ID
router.get('/doctor/:id', [
  param('id').isInt().withMessage('Doctor ID must be an integer'),
  validate
], getDoctorByIdController);

// Get doctors by department
router.get('/doctor/department/:departmentId', [
  param('departmentId').isInt().withMessage('Department ID must be an integer'),
  validate
], getDoctorsByDepartmentController);

// Create new doctor
router.post('/doctor', [
  body('Doctor').notEmpty().withMessage('Doctor name is required'),
  validate
], createDoctorController);

// Update doctor
router.put('/doctor/:id', [
  param('id').isInt().withMessage('Doctor ID must be an integer'),
  validate
], updateDoctorController);

// Delete doctor
router.delete('/doctor/:id', [
  param('id').isInt().withMessage('Doctor ID must be an integer'),
  validate
], deleteDoctorController);

export default router;