import {
  getDoctorVisitDays,
  addDoctorVisitDay,
  deleteDoctorVisitDay,
  updateDoctorVisitDays
} from '../../models/OPD/doctorvisitdt.model.js';

/**
 * Get all visit days for a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDoctorVisitDaysController = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const visitDays = await getDoctorVisitDays(doctorId);
    
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
};

/**
 * Update doctor visit days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateDoctorVisitDaysController = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { days } = req.body;
    
    if (!Array.isArray(days)) {
      return res.status(400).json({
        success: false,
        message: 'Days must be an array'
      });
    }
    
    await updateDoctorVisitDays(doctorId, days);
    
    res.status(200).json({
      success: true,
      message: 'Doctor visit days updated successfully'
    });
  } catch (error) {
    console.error('Error updating doctor visit days:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};