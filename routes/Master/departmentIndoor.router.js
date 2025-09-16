import express from 'express';
import { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../../controllers/Master/departmentIndoor.controller.js';
import { validateDepartmentData, validateId } from '../../middleware/departmentIndoor.validation.js';

const router = express.Router();

router.get('/', getDepartments);
router.get('/:id', validateId, getDepartmentById);
router.post('/', validateDepartmentData, createDepartment);
router.put('/:id', validateId, validateDepartmentData, updateDepartment);
router.delete('/:id', validateId, deleteDepartment);

export default router;