


// controllers/auth.controller.js
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../models/auth.model.js';

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For plain text password comparison
    if (password !== user.Password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.Admin !== 1) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Save session
    req.session.userId = user.UserId;
    req.session.isAdmin = true;

    res.json({ 
      message: 'Login successful', 
      userId: user.UserId
    });




  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
