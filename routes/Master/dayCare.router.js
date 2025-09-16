import express from 'express';
import { 
  getDayCares, 
  getDayCareById, 
  createDayCare, 
  updateDayCare, 
  deleteDayCare 
} from '../../controllers/Master/dayCare.controller.js';

const router = express.Router();

router.get('/', getDayCares);
router.get('/:id', getDayCareById);
router.post('/', createDayCare);
router.put('/:id', updateDayCare);
router.delete('/:id', deleteDayCare);

export default router;