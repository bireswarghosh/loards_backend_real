import express from 'express';
import {
  createAcSubGrp,
  getAllAcSubGrps,
  getAcSubGrpById,
  getAcGroupsForDropdown,
  updateAcSubGrp,
  deleteAcSubGrp
} from '../controllers/acSubGrp.controller.js';

const router = express.Router();

// Routes for AC Sub Groups
router.get('/', getAllAcSubGrps);
router.get('/ac-groups-dropdown', getAcGroupsForDropdown);
router.get('/:id', getAcSubGrpById);
router.post('/', createAcSubGrp);
router.put('/:id', updateAcSubGrp);
router.delete('/:id', deleteAcSubGrp);

export default router;