import express from 'express';
import {
  createAcHead,
  getAllAcHeads,
  getAcHeadById,
  updateAcHead,
  deleteAcHead
} from '../controllers/acHead.controller.js';

import {
  createAcGroup,
  getAllAcGroups,
  getAcGroupById,
  getAcHeadsForDropdown,
  updateAcGroup,
  deleteAcGroup
} from '../controllers/acGroup.controller.js';

import {
  createAcSubGrp,
  getAllAcSubGrps,
  getAcSubGrpById,
  getAcGroupsForDropdown,
  updateAcSubGrp,
  deleteAcSubGrp
} from '../controllers/acSubGrp.controller.js';

const router = express.Router();

// AC Head Routes
router.post('/ac-heads', createAcHead);
router.get('/ac-heads', getAllAcHeads);
router.get('/ac-heads/:id', getAcHeadById);
router.put('/ac-heads/:id', updateAcHead);
router.delete('/ac-heads/:id', deleteAcHead);

// AC Group Routes
router.post('/ac-groups', createAcGroup);
router.get('/ac-groups', getAllAcGroups);
router.get('/ac-groups/:id', getAcGroupById);
router.put('/ac-groups/:id', updateAcGroup);
router.delete('/ac-groups/:id', deleteAcGroup);

// AC Sub Group Routes
router.post('/ac-sub-groups', createAcSubGrp);
router.get('/ac-sub-groups', getAllAcSubGrps);
router.get('/ac-sub-groups/:id', getAcSubGrpById);
router.put('/ac-sub-groups/:id', updateAcSubGrp);
router.delete('/ac-sub-groups/:id', deleteAcSubGrp);

// Dropdown Routes
router.get('/ac-heads-dropdown', getAcHeadsForDropdown);
router.get('/ac-groups-dropdown', getAcGroupsForDropdown);

export default router;