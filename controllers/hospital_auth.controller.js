import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const loginController = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find hospital by email
    const [hospitals] = await db.query(
      'SELECT * FROM saas_registraction_table WHERE srt_hospital_email = ? AND srt_status = "active"',
      [email]
    );

    if (hospitals.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or hospital not active'
      });
    }

    const hospital = hospitals[0];

    // In a real app, you would verify the password hash here
    // For now, we'll assume the password is correct for testing
    // TODO: Implement proper password verification

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: hospital.srt_id,
        hospitalName: hospital.srt_hospital_name,
        email: hospital.srt_hospital_email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      hospital: {
        id: hospital.srt_id,
        name: hospital.srt_hospital_name,
        email: hospital.srt_hospital_email,
        type: hospital.srt_hospital_type,
        city: hospital.srt_city,
        state: hospital.srt_state
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};