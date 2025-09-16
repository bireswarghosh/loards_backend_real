// backend/routes/OPD/doctorvisitdt.router.js
import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import db from '../../config/db.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(authMiddleware);

// Get visit days for a doctor
router.get('/doctorvisitdt/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    const [rows] = await db.query(
      'SELECT VDay FROM doctorvisitdt WHERE DoctorId = ?',
      [doctorId]
    );
    
    // Map day names to day IDs for frontend
    const dayMap = {
      'SUN': 0,
      'MON': 1,
      'TUE': 2,
      'WED': 3,
      'THU': 4,
      'FRI': 5,
      'SAT': 6
    };
    
    // Convert to array of day IDs
    const visitDays = rows.map(row => dayMap[row.VDay]).filter(id => id !== undefined);
    
    res.status(200).json({
      success: true,
      data: visitDays
    });
  } catch (error) {
    console.error('Error fetching doctor visit days:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add visit day for a doctor
router.post('/doctorvisitdt', async (req, res) => {
  try {
    const { DoctorId, VDay, VisitOurId } = req.body;
    
    if (!DoctorId || !VDay) {
      return res.status(400).json({
        success: false,
        message: 'DoctorId and VDay are required'
      });
    }
    
    // Check if this day already exists for this doctor
    const [existingRows] = await db.query(
      'SELECT 1 FROM doctorvisitdt WHERE DoctorId = ? AND VDay = ?',
      [DoctorId, VDay]
    );
    
    if (existingRows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Visit day already exists'
      });
    }
    
    // Insert new visit day
    await db.query(
      'INSERT INTO doctorvisitdt (DoctorId, VDay, VisitOurId) VALUES (?, ?, ?)',
      [DoctorId, VDay, VisitOurId || 1]
    );
    
    res.status(201).json({
      success: true,
      message: 'Doctor visit day added successfully'
    });
  } catch (error) {
    console.error('Error adding doctor visit day:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});











// Update doctor visit days
router.put('/doctorvisitdt/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { days } = req.body;
    
    if (!Array.isArray(days)) {
      return res.status(400).json({
        success: false,
        message: 'Days must be an array'
      });
    }
    
    // Start a transaction
    await db.query('START TRANSACTION');
    
    try {
      // Delete existing visit days
      await db.query(
        'DELETE FROM doctorvisitdt WHERE DoctorId = ?',
        [doctorId]
      );
      
      // Add new visit days
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      for (const dayId of days) {
        if (dayId >= 0 && dayId < 7) {
          await db.query(
            'INSERT INTO doctorvisitdt (DoctorId, VDay, VisitOurId) VALUES (?, ?, ?)',
            [doctorId, dayNames[dayId], 1]
          );
        }
      }
      
      // Commit the transaction
      await db.query('COMMIT');
      
      res.status(200).json({
        success: true,
        message: 'Doctor visit days updated successfully'
      });
    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating doctor visit days:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});



















// Delete all visit days for a doctor
router.delete('/doctorvisitdt/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    await db.query(
      'DELETE FROM doctorvisitdt WHERE DoctorId = ?',
      [doctorId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Doctor visit days deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor visit days:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
