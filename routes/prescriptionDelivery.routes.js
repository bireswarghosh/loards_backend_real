import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  createPrescriptionDelivery,
  getAllPrescriptionDeliveries,
  getPrescriptionDeliveryById,
  updateDeliveryStatus,
  getDeliveriesByPatientId,
  getPatients
} from '../controllers/prescriptionDelivery.controller.js';

const router = express.Router();

// Configure multer for prescription image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription_' + uniqueSuffix + path.extname(file.originalname));
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

// Prescription delivery routes
router.post('/', upload.single('prescription_image'), createPrescriptionDelivery);
router.get('/', getAllPrescriptionDeliveries);
router.get('/patients', getPatients);
router.get('/patient/:patientId', getDeliveriesByPatientId);
router.get('/:id', getPrescriptionDeliveryById);
router.put('/:id/status', updateDeliveryStatus);

export default router;