import express from 'express';
import { admissionController } from '../../controllers/OPD/admission.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// CREATE - Add new admission
router.post('/admission', authMiddleware, admissionController.create);

// READ - Get all admissions with pagination and search
router.get('/admission', authMiddleware, admissionController.getAll);

// SEARCH - Search admissions by patient name or phone (must be before :id route)
router.get('/admission/search', authMiddleware, admissionController.search);

// FILTER - Get admissions by date range (must be before :id route)
router.get('/admission/filter', authMiddleware, admissionController.filterByDate);

// READ - Get specific admission by ID (supports compound IDs like 000051/25-26)
router.get('/admission/:id(*)', authMiddleware, admissionController.getById);

// UPDATE - Update admission
router.put('/admission/:id(*)', authMiddleware, admissionController.update);

// DELETE - Delete admission
router.delete('/admission/:id(*)', authMiddleware, admissionController.delete);

export default router;