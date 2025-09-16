// Routes for patient sign up and sign in (no auth token required)
import express from 'express';
const router = express.Router();
import { signup, signin, getProfile, updateProfile, getPatientAmbulanceBookings } from '../../../controllers/appointment_booking_app/For  Patient/patientAuth.controller.js';

// Sign Up
router.post('/signup', signup);
// Sign In
router.post('/signin', signin);
// Get Profile
router.get('/profile/:id', getProfile);
// Update Profile
router.put('/profile/:id', updateProfile);
// Get Patient's Ambulance Bookings
router.get('/ambulance-bookings/:id', getPatientAmbulanceBookings);

export default router;
