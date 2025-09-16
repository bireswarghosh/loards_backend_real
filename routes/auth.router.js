import express from 'express';
import { body } from 'express-validator';
import { loginController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
  '/auth/login',  // Change from '/login' to '/auth/login'
  [ 

    body('username').trim().notEmpty().withMessage('UserName is required'),
    body('password').notEmpty().withMessage('Password is required')
    
  ],
  loginController
);


export default router;




