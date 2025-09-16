import express from 'express';
import { signup, signin } from './controllers/appointment_booking_app/For  Patient/patientAuth.controller.js';

const router = express.Router();

// Sign Up - No auth required
router.post('/signup', signup);

// Sign In - No auth required
router.post('/signin', signin);

export default router;