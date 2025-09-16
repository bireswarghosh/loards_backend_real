import express from 'express';
import TestController from '../controllers/test.controller.js';

const router = express.Router();

// GET /api/tests - Get all tests
router.get('/', TestController.getAllTests);

// GET /api/tests/search?q=searchTerm - Search tests
router.get('/search', TestController.searchTests);

// GET /api/tests/department/:departmentId - Get tests by department
router.get('/department/:departmentId', TestController.getTestsByDepartment);

// GET /api/tests/:id - Get test by ID
router.get('/:id', TestController.getTestById);

// POST /api/tests - Create new test
router.post('/', TestController.createTest);

// PUT /api/tests/:id - Update test
router.put('/:id', TestController.updateTest);

// DELETE /api/tests/:id - Delete test
router.delete('/:id', TestController.deleteTest);

export default router;