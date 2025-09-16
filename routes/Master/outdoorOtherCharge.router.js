import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getOutdoorOtherCharges,
  getOutdoorOtherCharge,
  createOutdoorOtherCharge,
  updateOutdoorOtherCharge,
  deleteOutdoorOtherCharge
} from '../../controllers/Master/outdoorOtherCharge.controller.js';

const router = express.Router();

const chargeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', chargeLimiter, getOutdoorOtherCharges);
router.get('/:id', chargeLimiter, getOutdoorOtherCharge);
router.post('/', chargeLimiter, createOutdoorOtherCharge);
router.put('/:id', chargeLimiter, updateOutdoorOtherCharge);
router.delete('/:id', chargeLimiter, deleteOutdoorOtherCharge);

export default router;