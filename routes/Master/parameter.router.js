import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getParameters,
  updateParameters,
  getParameter,
  updateParameter
} from '../../controllers/Master/parameter.controller.js';

const router = express.Router();

// Rate limiting
const parameterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests' }
});

// Validation for Y/N fields
const validateYN = (field) => body(field).optional().isIn(['Y', 'N', 'y', 'n', null]);

// Routes
router.get('/', parameterLimiter, getParameters);
router.put('/', parameterLimiter, updateParameters);
router.get('/:field', parameterLimiter, getParameter);
router.put('/:field', parameterLimiter, updateParameter);

export default router;