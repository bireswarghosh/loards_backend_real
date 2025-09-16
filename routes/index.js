import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import doctorMasterRoutes from './OPD/doctormaster.routes.js';
import specialityRoutes from './OPD/speciality.routes.js';
import doctorVisitRoutes from './OPD/doctorvisit.routes.js';
import hospitalRegistrationRoutes from './hospital_registration.router.js';
import packageRoutes from './package.router.js';
import departmentIndoorRoutes from './Master/departmentIndoor.router.js';
import testRoutes from './test.routes.js';
// Import other route files as needed

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctormaster', doctorMasterRoutes);
router.use('/speciality', specialityRoutes);
router.use('/doctorvisit', doctorVisitRoutes);
router.use('/hospital-registration', hospitalRegistrationRoutes);
router.use('/packages', packageRoutes);
router.use('/department-indoor', departmentIndoorRoutes);
router.use('/tests', testRoutes);
// Add other routes as needed

export default router;