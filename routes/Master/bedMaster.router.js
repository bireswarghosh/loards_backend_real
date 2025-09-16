import express from 'express';
import { 
  getBeds, 
  getBedById, 
  createBed, 
  updateBed, 
  deleteBed 
} from '../../controllers/Master/bedMaster.controller.js';
import { validateBedData, validateId } from '../../middleware/bedMaster.validation.js';

const router = express.Router();

router.get('/', getBeds);
router.get('/:id', validateId, getBedById);
router.post('/', validateBedData, createBed);
router.put('/:id', validateId, validateBedData, updateBed);
router.delete('/:id', validateId, deleteBed);

export default router;






















