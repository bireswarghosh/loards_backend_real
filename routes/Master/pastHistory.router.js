import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getPastHistories,
  getPastHistory,
  createPastHistory,
  updatePastHistory,
  deletePastHistory
} from '../../controllers/Master/pastHistory.controller.js';

const router = express.Router();

const historyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', historyLimiter, getPastHistories);
router.get('/:id', historyLimiter, getPastHistory);
router.post('/', historyLimiter, createPastHistory);
router.put('/:id', historyLimiter, updatePastHistory);
router.delete('/:id', historyLimiter, deletePastHistory);

export default router;