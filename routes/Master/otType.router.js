import express from 'express';
import { 
  getOtTypes, 
  getOtTypeById, 
  createOtType, 
  updateOtType, 
  deleteOtType 
} from '../../controllers/Master/otType.controller.js';

const router = express.Router();

router.get('/', getOtTypes);
router.get('/:id', getOtTypeById);
router.post('/', createOtType);
router.put('/:id', updateOtType);
router.delete('/:id', deleteOtType);

export default router;