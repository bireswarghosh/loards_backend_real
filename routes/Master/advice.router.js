import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllAdvices, getAdviceById, createAdvice, updateAdvice, deleteAdvice } from '../../controllers/Master/advice.controller.js';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Routes
router.get('/', getAllAdvices);
router.get('/:id', getAdviceById);
router.post('/', createAdvice);
router.put('/:id', updateAdvice);
router.delete('/:id', deleteAdvice);

export default router;