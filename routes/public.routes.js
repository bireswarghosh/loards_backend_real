// Public routes that don't require authentication
import express from 'express';
import { signup, signin } from '../controllers/appointment_booking_app/For  Patient/patientAuth.controller.js';

const router = express.Router();

// Patient auth routes
router.post('/patient-auth/signup', signup);
router.post('/patient-auth/signin', signin);

export default router;