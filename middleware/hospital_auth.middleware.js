import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const hospitalAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if hospital exists and is active
    const [hospitals] = await db.query(
      'SELECT srt_id, srt_hospital_name, srt_hospital_email, srt_status FROM saas_registraction_table WHERE srt_id = ? AND srt_status = "active"',
      [decoded.id]
    );

    if (hospitals.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Hospital not found or not active'
      });
    }

    // Add hospital info to request
    req.hospital = {
      id: hospitals[0].srt_id,
      name: hospitals[0].srt_hospital_name,
      email: hospitals[0].srt_hospital_email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};