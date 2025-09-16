import express from 'express';
import { 
  getOtItems, 
  getOtItemById, 
  createOtItem, 
  updateOtItem, 
  deleteOtItem,
  getOtCategories
} from '../../controllers/Master/otItem.controller.js';

const router = express.Router();

router.get('/', getOtItems);
router.get('/categories', getOtCategories);
router.get('/:id', getOtItemById);
router.post('/', createOtItem);
router.put('/:id', updateOtItem);
router.delete('/:id', deleteOtItem);

export default router;