import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  addAmbulance, 
  getAllAmbulances, 
  getAmbulanceById, 
  updateAmbulance, 
  deleteAmbulance,
  createPickupRequest,
  getAllPickupRequests,
  getPickupRequestsByAmbulanceId,
  updatePickupRequestStatus,
  deletePickupRequest,
  getPickupRequestsByPatientId
} from '../controllers/ambulanceController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Skip auth middleware for all ambulance routes
router.use((req, res, next) => {
  // Set a flag to indicate this is an ambulance route
  req.isAmbulanceRoute = true;
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/ambulance'));
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
router.post('/', upload.single('logo'),authMiddleware, addAmbulance);
router.get('/',authMiddleware, getAllAmbulances);
router.get('/:id',authMiddleware, getAmbulanceById);
router.put('/:id', upload.single('logo'),authMiddleware, updateAmbulance);
router.delete('/:id',authMiddleware, deleteAmbulance);

// Ambulance pickup request routes
router.post('/pickup',authMiddleware, createPickupRequest);
router.get('/pickup/all',authMiddleware, getAllPickupRequests);
router.get('/pickup/:id', authMiddleware,getPickupRequestsByAmbulanceId);
router.put('/pickup/:id/status',authMiddleware, updatePickupRequestStatus);
router.delete('/pickup/:id',authMiddleware, deletePickupRequest);
router.get('/pickup/patient/:patientId',authMiddleware, getPickupRequestsByPatientId);

export default router;