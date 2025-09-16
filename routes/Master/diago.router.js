import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getDiagos,
  getDiago,
  createDiago,
  updateDiago,
  deleteDiago
} from '../../controllers/Master/diago.controller.js';

const router = express.Router();

const diagoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', diagoLimiter, getDiagos);
router.get('/:id', diagoLimiter, getDiago);
router.post('/', diagoLimiter, createDiago);
router.put('/:id', diagoLimiter, updateDiago);
router.delete('/:id', diagoLimiter, deleteDiago);

export default router;