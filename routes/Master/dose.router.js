import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllDoses, getDoseById, createDose, updateDose, deleteDose } from '../../controllers/Master/dose.controller.js';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Routes
router.get('/', getAllDoses);
router.get('/:id', getDoseById);
router.post('/', createDose);
router.put('/:id', updateDose);
router.delete('/:id', deleteDose);

export default router;