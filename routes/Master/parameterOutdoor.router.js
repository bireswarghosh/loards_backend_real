import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getOutdoorParameters,
  updateOutdoorParameters,
  getOutdoorParameter,
  updateOutdoorParameter
} from '../../controllers/Master/parameterOutdoor.controller.js';

const router = express.Router();

// Rate limiting
const parameterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests' }
});

// Routes
router.get('/', parameterLimiter, getOutdoorParameters);
router.put('/', parameterLimiter, updateOutdoorParameters);
router.get('/:field', parameterLimiter, getOutdoorParameter);
router.put('/:field', parameterLimiter, updateOutdoorParameter);

export default router;