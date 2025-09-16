import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
  getAllDepartmentsController, 
  getDepartmentByIdController, 
  createDepartmentController, 
  updateDepartmentController, 
  deleteDepartmentController 
} from '../../controllers/OPD/department.controller.js';
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

// Get all departments
router.get('/department', (req, res, next) => {
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
}, getAllDepartmentsController);

// Get department by ID
router.get('/department/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, getDepartmentByIdController);

// Create new department
router.post('/department', [
  body('Department').trim().isLength({ min: 1, max: 50 }).withMessage('Department name is required (max 50 chars)'),
  body('DepShName').trim().isLength({ max: 10 }).withMessage('Short name must be max 10 characters'),
  body('BP').optional().isInt().withMessage('BP must be an integer')
], validate, createDepartmentController);

// Update department
router.put('/department/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('Department').trim().isLength({ min: 1, max: 50 }).withMessage('Department name is required (max 50 chars)'),
  body('DepShName').trim().isLength({ max: 10 }).withMessage('Short name must be max 10 characters'),
  body('BP').optional().isInt().withMessage('BP must be an integer')
], validate, updateDepartmentController);

// Delete department
router.delete('/department/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, deleteDepartmentController);

export default router;