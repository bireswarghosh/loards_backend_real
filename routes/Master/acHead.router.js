import express from 'express';
import { getAcHeads, createAcHead, updateAcHead, deleteAcHead } from '../../controllers/Master/acHead.controller.js';

const router = express.Router();

router.get('/', getAcHeads);
router.post('/', createAcHead);
router.put('/:id', updateAcHead);
router.delete('/:id', deleteAcHead);

export default router;