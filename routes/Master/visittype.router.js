import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllVisittypes, getVisittypeById, createVisittype, updateVisittype, deleteVisittype } from '../../controllers/Master/visittype.controller.js';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Routes
router.get('/', getAllVisittypes);
router.get('/:id', getVisittypeById);
router.post('/', createVisittype);
router.put('/:id', updateVisittype);
router.delete('/:id', deleteVisittype);

export default router;