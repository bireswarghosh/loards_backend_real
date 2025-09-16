import express from 'express';
import { body, param, query } from 'express-validator';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import * as BookingController from '../../controllers/OPD/booking.controller.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

// Get all bookings with pagination and filters
router.get('/booking', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], BookingController.getAllBookings);

// Get booking by ID
router.get('/booking/:id', [
  param('id').notEmpty().withMessage('Booking ID is required')
], BookingController.getBookingById);

// Create new booking
router.post('/booking', [
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('sex').isIn(['M', 'F', 'O']).withMessage('Sex must be M, F, or O'),
  body('doctorId').isInt().withMessage('Doctor ID must be an integer')
], BookingController.createBooking);

// Update booking
router.put('/booking/:id', [
  param('id').notEmpty().withMessage('Booking ID is required')
], BookingController.updateBooking);

// Cancel booking
router.patch('/booking/:id/cancel', [
  param('id').notEmpty().withMessage('Booking ID is required'),
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], BookingController.cancelBooking);

// Delete booking
router.delete('/booking/:id', [
  param('id').notEmpty().withMessage('Booking ID is required')
], BookingController.deleteBooking);

export default router;