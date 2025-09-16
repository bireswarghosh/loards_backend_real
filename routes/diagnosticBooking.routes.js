import express from 'express';
import multer from 'multer';
import path from 'path';
import DiagnosticBookingController from '../controllers/diagnosticBooking.controller.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/diagnostic/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'diagnostic_prescription_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/v1/diagnostic/bookings - Get all bookings (must be before /:id route)
router.get('/bookings', DiagnosticBookingController.getAllBookings);

// GET /api/v1/diagnostic/patient/:patientId/bookings - Get bookings by patient
router.get('/patient/:patientId/bookings', DiagnosticBookingController.getBookingsByPatient);

// POST /api/v1/diagnostic/booking - Create diagnostic booking with file upload
router.post('/booking', upload.single('diagnostic_prescription'), DiagnosticBookingController.createBooking);

// GET /api/v1/diagnostic/booking/:id - Get booking by ID
router.get('/booking/:id', DiagnosticBookingController.getBookingById);

// PUT /api/v1/diagnostic/booking/:id/status - Update booking status
router.put('/booking/:id/status', DiagnosticBookingController.updateBookingStatus);

export default router;