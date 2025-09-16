import express from 'express';
import { 
  bookNursingPackage,
  getAllNursingBookings,
  getNursingBookingById,
  updateBookingStatus,
  getBookingsByPatientId,
  getAdmissions
} from '../controllers/nursingBookingController.js';

const router = express.Router();

// Nursing booking routes
router.post('/', bookNursingPackage);
router.get('/', getAllNursingBookings);
router.get('/admissions', getAdmissions);
router.get('/patient/:patientId', getBookingsByPatientId);
router.get('/:id', getNursingBookingById);
router.put('/:id/status', updateBookingStatus);

export default router;