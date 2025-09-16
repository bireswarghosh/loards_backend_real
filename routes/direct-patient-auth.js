// Direct patient auth routes with no auth middleware
import express from 'express';
import { signup, signin, updateProfile, getProfile } from '../controllers/appointment_booking_app/For  Patient/patientAuth.controller.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);

// Profile routes
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

export default router;