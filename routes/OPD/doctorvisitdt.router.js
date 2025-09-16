import express from 'express';
import { param, body } from 'express-validator';
import { 
  getDoctorVisitDaysController,
  updateDoctorVisitDaysController
} from '../../controllers/OPD/doctorvisitdt.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

// Get all visit days for a doctor
router.get('/doctorvisitdt/:doctorId', [
  param('doctorId').isInt().withMessage('Doctor ID must be an integer')
], getDoctorVisitDaysController);

// Update doctor visit days
router.put('/doctorvisitdt/:doctorId', [
  param('doctorId').isInt().withMessage('Doctor ID must be an integer'),
  body('days').isArray().withMessage('Days must be an array')
], updateDoctorVisitDaysController);

export default router;