import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
  getAllReligionsController, 
  // getReligionByIdController, 
  // createReligionController, 
  // updateReligionController, 
  // deleteReligionController 
} from '../../controllers/OPD/religion.controller.js';
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

// Get all religions
router.get('/religion', (req, res, next) => {
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
}, getAllReligionsController);

// // Get religion by ID
// router.get('/religion/:id', [
//   param('id').isInt().withMessage('ID must be an integer')
// ], validate, getReligionByIdController);

// // Create new religion
// router.post('/religion', [
//   body('religion_name').trim().isLength({ min: 2, max: 50 }).withMessage('Religion name must be between 2-50 characters')
// ], validate, createReligionController);

// // Update religion
// router.put('/religion/:id', [
//   param('id').isInt().withMessage('ID must be an integer'),
//   body('religion_name').trim().isLength({ min: 2, max: 50 }).withMessage('Religion name must be between 2-50 characters')
// ], validate, updateReligionController);

// // Delete religion
// router.delete('/religion/:id', [
//   param('id').isInt().withMessage('ID must be an integer')
// ], validate, deleteReligionController);

export default router;