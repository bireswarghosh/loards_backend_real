import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getRoomNos,
  getRoomNo,
  createRoomNo,
  updateRoomNo,
  deleteRoomNo
} from '../../controllers/Master/roomNo.controller.js';

const router = express.Router();

const roomLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', roomLimiter, getRoomNos);
router.get('/:id', roomLimiter, getRoomNo);
router.post('/', roomLimiter, createRoomNo);
router.put('/:id', roomLimiter, updateRoomNo);
router.delete('/:id', roomLimiter, deleteRoomNo);

export default router;