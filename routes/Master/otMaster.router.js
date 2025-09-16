import express from 'express';
import { 
  getOtMasters, 
  getOtMasterById, 
  createOtMaster, 
  updateOtMaster, 
  deleteOtMaster 
} from '../../controllers/Master/otMaster.controller.js';

const router = express.Router();

router.get('/', getOtMasters);
router.get('/:id', getOtMasterById);
router.post('/', createOtMaster);
router.put('/:id', updateOtMaster);
router.delete('/:id', deleteOtMaster);

export default router;