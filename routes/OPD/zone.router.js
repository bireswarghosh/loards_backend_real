// import express from 'express';
// import { 
//   getAllZonesController, 
//   getZoneByIdController, 
//   createZoneController, 
//   updateZoneController, 
//   deleteZoneController 
// } from '../../controllers/OPD/zone.controller.js';

// const router = express.Router();

// // Define routes
// router.get('/zone', getAllZonesController);
// router.get('/zone/:id', getZoneByIdController);
// router.post('/zone', createZoneController);
// router.put('/zone/:id', updateZoneController);
// router.delete('/zone/:id', deleteZoneController);

// export default router;







import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { 
  getAllZonesController, 
  getZoneByIdController, 
  createZoneController, 
  updateZoneController, 
  deleteZoneController 
} from '../../controllers/OPD/zone.controller.js';
const router = express.Router();

// Custom error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Define routes with validation and caching
router.get('/zone', (req, res, next) => {
  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
}, getAllZonesController);

router.get('/zone/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, getZoneByIdController);

router.post('/zone', [
  body('zone_name').trim().isLength({ min: 2, max: 50 }).withMessage('Zone name must be between 2-50 characters')
], validate, createZoneController);

router.put('/zone/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('zone_name').trim().isLength({ min: 2, max: 50 }).withMessage('Zone name must be between 2-50 characters')
], validate, updateZoneController);

router.delete('/zone/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], validate, deleteZoneController);

export default router;
