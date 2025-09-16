import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
    getAllDepartmentGroups, 
    getDepartmentById, 
    createDepartmentGroup, 
    updateDepartmentGroup, 
    deleteDepartmentGroup,
    searchDepartmentGroups
} from '../../controllers/Master/Department_group.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

// Custom error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes with validation and caching
router.get('/', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
}, getAllDepartmentGroups);

router.get('/search', searchDepartmentGroups);

router.get('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, getDepartmentById);

router.post('/', [
  body('DepGroup').optional().isLength({ min: 1, max: 50 }).trim().withMessage('DepGroup must be 1-50 characters'),
  body('Anst').optional().isFloat({ min: 0 }).withMessage('Anst must be a positive number'),
  body('Assi').optional().isFloat({ min: 0 }).withMessage('Assi must be a positive number'),
  body('Sour').optional().isFloat({ min: 0 }).withMessage('Sour must be a positive number')
], validate, createDepartmentGroup);

router.put('/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('DepGroup').optional().isLength({ min: 1, max: 50 }).trim().withMessage('DepGroup must be 1-50 characters'),
  body('Anst').optional().isFloat({ min: 0 }).withMessage('Anst must be a positive number'),
  body('Assi').optional().isFloat({ min: 0 }).withMessage('Assi must be a positive number'),
  body('Sour').optional().isFloat({ min: 0 }).withMessage('Sour must be a positive number')
], validate, updateDepartmentGroup);

router.delete('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, deleteDepartmentGroup);

export default router;