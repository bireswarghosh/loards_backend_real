import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { 
  getAllDoctorsController,
  getDoctorByIdController,
  getDoctorPhotoController,
  getDoctorsBySpecialityController,
  createDoctorController,
  updateDoctorController,
  deleteDoctorController
} from '../../controllers/OPD/doctormaster.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/doctors');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'doctor-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

// Routes
router.get('/', verifyToken, getAllDoctorsController);
router.get('/:id', verifyToken, getDoctorByIdController);
router.get('/:id/photo', getDoctorPhotoController); // Public route for photos
router.get('/speciality/:specialityId', verifyToken, getDoctorsBySpecialityController);
router.post('/', verifyToken, upload.single('Photo'), createDoctorController);
router.put('/:id', verifyToken, upload.single('Photo'), updateDoctorController);
router.delete('/:id', verifyToken, deleteDoctorController);

export default router;