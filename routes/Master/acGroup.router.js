import express from 'express';
import { getAcGroups, createAcGroup, updateAcGroup, deleteAcGroup, getAcHeadsForDropdown } from '../../controllers/Master/acGroup.controller.js';

const router = express.Router();

router.get('/', getAcGroups);
router.get('/acheads', getAcHeadsForDropdown);
router.post('/', createAcGroup);
router.put('/:id', updateAcGroup);
router.delete('/:id', deleteAcGroup);

export default router;