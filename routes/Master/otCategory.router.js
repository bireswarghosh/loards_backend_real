import express from 'express';
import { 
  getOtCategories, 
  getOtCategoryById, 
  createOtCategory, 
  updateOtCategory, 
  deleteOtCategory 
} from '../../controllers/Master/otCategory.controller.js';

const router = express.Router();

router.get('/', getOtCategories);
router.get('/:id', getOtCategoryById);
router.post('/', createOtCategory);
router.put('/:id', updateOtCategory);
router.delete('/:id', deleteOtCategory);

export default router;