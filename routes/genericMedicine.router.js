import express from 'express';
import {
  createGenericMedicine,
  getAllGenericMedicines,
  getGenericMedicineById,
  searchGenericMedicines,
  updateGenericMedicine,
  deleteGenericMedicine
} from '../controllers/genericMedicine.controller.js';

const router = express.Router();

// CREATE - Add new generic medicine
router.post('/generic-medicines', createGenericMedicine);

// READ - Get all medicines with pagination
router.get('/generic-medicines', getAllGenericMedicines);

// READ - Search medicines (dictionary functionality)
router.get('/generic-medicines/search', searchGenericMedicines);

// READ - Get medicine by ID
router.get('/generic-medicines/:id', getGenericMedicineById);

// UPDATE - Update medicine
router.put('/generic-medicines/:id', updateGenericMedicine);

// DELETE - Delete medicine
router.delete('/generic-medicines/:id', deleteGenericMedicine);

export default router;