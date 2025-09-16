import express from 'express';
import {
  createAcGenLed,
  getAllAcGenLeds,
  getAcGenLedById,
  getAcSubGroupsForDropdown,
  updateAcGenLed,
  deleteAcGenLed
} from '../controllers/acGenLed.controller.js';

const router = express.Router();

// Routes for AC General Ledger
router.get('/', getAllAcGenLeds);
router.get('/ac-subgroups-dropdown', getAcSubGroupsForDropdown);
router.get('/:id', getAcGenLedById);
router.post('/', createAcGenLed);
router.put('/:id', updateAcGenLed);
router.delete('/:id', deleteAcGenLed);

export default router;