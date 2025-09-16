import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getChiefs,
  getChief,
  createChief,
  updateChief,
  deleteChief
} from '../../controllers/Master/chief.controller.js';

const router = express.Router();

const chiefLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', chiefLimiter, getChiefs);
router.get('/:id', chiefLimiter, getChief);
router.post('/', chiefLimiter, createChief);
router.put('/:id', chiefLimiter, updateChief);
router.delete('/:id', chiefLimiter, deleteChief);

export default router;