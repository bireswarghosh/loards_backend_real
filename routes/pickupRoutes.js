import express from 'express';
import { 
  addPickupRequest, 
  getAllPickupRequests, 
  getPickupRequestById, 
  updatePickupRequest, 
  deletePickupRequest,
  getPickupRequestsByPatientId,
  getPickupRequestsByAmbulanceId 
} from '../controllers/appointment_booking_app/ForAmbulance/pickupController.js';

const router = express.Router();

// Pickup request routes
router.post('/', addPickupRequest);
router.get('/', getAllPickupRequests);
router.get('/patient/:patientId', getPickupRequestsByPatientId);
router.get('/ambulance/:ambulanceId', getPickupRequestsByAmbulanceId);
router.get('/:id', getPickupRequestById);
router.put('/:id', updatePickupRequest);
router.delete('/:id', deletePickupRequest);

export default router;