import express from 'express';
import { 
  getCashless, 
  getCashlessById, 
  createCashless, 
  updateCashless, 
  deleteCashless,
  getAcGenLeds
} from '../../controllers/Master/cashless.controller.js';

const router = express.Router();

router.get('/', getCashless);
router.get('/acgenleds', getAcGenLeds);
router.get('/:id', getCashlessById);
router.post('/', createCashless);
router.put('/:id', updateCashless);
router.delete('/:id', deleteCashless);

export default router;