import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllVisitours, getVisitourById, createVisitour, updateVisitour, deleteVisitour } from '../../controllers/Master/visitour.controller.js';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Routes
router.get('/', getAllVisitours);
router.get('/:id', getVisitourById);
router.post('/', createVisitour);
router.put('/:id', updateVisitour);
router.delete('/:id', deleteVisitour);

export default router;