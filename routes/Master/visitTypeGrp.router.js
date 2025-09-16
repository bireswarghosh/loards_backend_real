import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllVisittypegrps, getVisittypegrpById, createVisittypegrp, updateVisittypegrp, deleteVisittypegrp } from '../../controllers/Master/visitTypeGrp.controller.js';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Routes
router.get('/', getAllVisittypegrps);
router.get('/:id', getVisittypegrpById);
router.post('/', createVisittypegrp);
router.put('/:id', updateVisittypegrp);
router.delete('/:id', deleteVisittypegrp);

export default router;