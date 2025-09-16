import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  searchPackages
} from '../../controllers/Master/package.controller.js';

const router = express.Router();

// Rate limiting
const packageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests' }
});

// Validation rules
const packageValidation = [
  body('Package').optional().isLength({ min: 1, max: 255 }).trim(),
  body('DescId').optional().isInt({ min: 1 }),
  body('Rate').optional().isFloat({ min: 0 }),
  body('GSTAmt').optional().isFloat({ min: 0 })
];

// Routes
router.get('/', packageLimiter, getAllPackages);
router.get('/search', packageLimiter, searchPackages);
router.get('/:id', packageLimiter, getPackageById);
router.post('/', packageLimiter, packageValidation, createPackage);
router.put('/:id', packageLimiter, packageValidation, updatePackage);
router.delete('/:id', packageLimiter, deletePackage);



export default router;