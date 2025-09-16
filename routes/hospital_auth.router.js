import express from 'express';
import { body } from 'express-validator';
import { loginController } from '../controllers/hospital_auth.controller.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginController
);

export default router;