import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../../controllers/Master/service.controller.js';

const router = express.Router();

const serviceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

router.get('/', serviceLimiter, getServices);
router.get('/:id', serviceLimiter, getService);
router.post('/', serviceLimiter, createService);
router.put('/:id', serviceLimiter, updateService);
router.delete('/:id', serviceLimiter, deleteService);

export default router;