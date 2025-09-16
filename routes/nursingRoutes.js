import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  addNursingCategory, 
  getAllNursingCategories, 
  getNursingCategoryById, 
  updateNursingCategory, 
  deleteNursingCategory,
  addNursingPackage,
  getNursingPackagesByCategoryId
} from '../controllers/nursingController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/nursing'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'nursing-' + uniqueSuffix + path.extname(file.originalname));
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

// Nursing category routes
router.post('/', upload.single('logo'), addNursingCategory);
router.get('/', getAllNursingCategories);
router.get('/:id', getNursingCategoryById);
router.put('/:id', upload.single('logo'), updateNursingCategory);
router.delete('/:id', deleteNursingCategory);

// Nursing package routes
router.post('/packages', addNursingPackage);
router.get('/packages/:categoryId', getNursingPackagesByCategoryId);

export default router;