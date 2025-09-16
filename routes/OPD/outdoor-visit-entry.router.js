import express from 'express';
import { outdoorVisitEntryHandler, getOutdoorVisitById, updateOutdoorVisitById, deleteOutdoorVisitById } from '../../controllers/OPD/outdoor-visit-entry.controller.js';

const router = express.Router();

// Single endpoint for all outdoor visit operations
router.post('/outdoor-visit-entry', outdoorVisitEntryHandler);

// REST endpoints for easier testing - handle RegistrationId with slash
router.get('/outdoor-visit-entry/:regNum/:year', getOutdoorVisitById);
router.put('/outdoor-visit-entry/:regNum/:year', updateOutdoorVisitById);
router.delete('/outdoor-visit-entry/:regNum/:year', deleteOutdoorVisitById);

export default router;