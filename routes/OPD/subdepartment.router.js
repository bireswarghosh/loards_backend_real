import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
  getAllSubDepartmentsController, 
  getSubDepartmentByIdController,
  getSubDepartmentsByDepartmentController,
  createSubDepartmentController, 
  updateSubDepartmentController, 
  deleteSubDepartmentController 
} from '../../controllers/OPD/subdepartment.controller.js';
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

// Get all subdepartments
router.get('/subdepartment', (req, res, next) => {
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
}, getAllSubDepartmentsController);

// Get subdepartment by ID
router.get('/subdepartment/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, getSubDepartmentByIdController);

// Get subdepartments by department ID
router.get('/subdepartment/department/:departmentId', [
  param('departmentId').isInt().withMessage('Department ID must be an integer')
], validate, getSubDepartmentsByDepartmentController);

// Create new subdepartment
router.post('/subdepartment', [
  body('SubDepartment').trim().isLength({ min: 1, max: 50 }).withMessage('SubDepartment name is required (max 50 chars)'),
  body('DepartmentId').isInt().withMessage('DepartmentId must be an integer'),
  body('SpRemTag').optional().isInt().withMessage('SpRemTag must be an integer')
], validate, createSubDepartmentController);

// Update subdepartment
router.put('/subdepartment/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('SubDepartment').trim().isLength({ min: 1, max: 50 }).withMessage('SubDepartment name is required (max 50 chars)'),
  body('DepartmentId').isInt().withMessage('DepartmentId must be an integer'),
  body('SpRemTag').optional().isInt().withMessage('SpRemTag must be an integer')
], validate, updateSubDepartmentController);

// Delete subdepartment
router.delete('/subdepartment/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, deleteSubDepartmentController);

export default router;