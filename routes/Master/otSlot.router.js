import express from 'express';
import { 
  getOtSlots, 
  getOtSlotById, 
  createOtSlot, 
  updateOtSlot, 
  deleteOtSlot,
  getOtMasters,
  getDepGroups
} from '../../controllers/Master/otSlot.controller.js';

const router = express.Router();

router.get('/', getOtSlots);
router.get('/otmasters', getOtMasters);
router.get('/depgroups', getDepGroups);
router.get('/:id', getOtSlotById);
router.post('/', createOtSlot);
router.put('/:id', updateOtSlot);
router.delete('/:id', deleteOtSlot);

export default router;