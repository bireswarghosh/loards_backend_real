import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  addAmbulance, 
  getAllAmbulances, 
  getAmbulanceById, 
  updateAmbulance, 
  deleteAmbulance 
} from '../../../controllers/appointment_booking_app/ForAmbulance/ambulanceController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads/ambulance'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ambulance-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Ambulance routes
router.post('/', upload.single('logo'), addAmbulance);
router.get('/', getAllAmbulances);
router.get('/:id', getAmbulanceById);
router.put('/:id', upload.single('logo'), updateAmbulance);
router.delete('/:id', deleteAmbulance);

export default router;