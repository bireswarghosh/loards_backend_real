import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getPackageWithIncludes,
  getIncludesByPackageId,
  createInclude,
  updateInclude,
  deleteInclude
} from '../../controllers/Master/packinclude.controller.js';

const router = express.Router();

// Rate limiting
const includeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

// Validation
const includeValidation = [
  body('PackageId').isInt({ min: 1 }),
  body('IncHead').optional().isLength({ min: 1, max: 50 }).trim(),
  body('IncHeadRate').optional().isFloat({ min: 0 })
];

// Routes
router.get('/package/:packageId', includeLimiter, getPackageWithIncludes);
router.get('/package/:packageId/includes', includeLimiter, getIncludesByPackageId);
router.post('/', includeLimiter, includeValidation, createInclude);
router.put('/package/:packageId/include/:includeId', includeLimiter, updateInclude);
router.delete('/package/:packageId/include/:includeId', includeLimiter, deleteInclude);

export default router;