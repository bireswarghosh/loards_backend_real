import {
  getAllDoctorVisits,
  getDoctorVisitById,
  getDoctorVisitsByAdmission,
  createDoctorVisit,
  updateDoctorVisit,
  deleteDoctorVisit,
  generateDoctorVisitId
} from '../../models/OPD/doctorvisit.model.js';

/**
 * Get all doctor visits
 */
export const getAllDoctorVisitsController = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 100,
      offset: parseInt(req.query.offset) || 0,
      admissionId: req.query.admissionId || null
    };
    
    const visits = await getAllDoctorVisits(options);
    
    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    console.error('Error fetching doctor visits:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctor visit by ID
 */
export const getDoctorVisitByIdController = async (req, res) => {
  try {
    const visit = await getDoctorVisitById(req.params.id);
    
    if (!visit) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor visit not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: visit
    });
  } catch (error) {
    console.error('Error fetching doctor visit:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctor visits by admission ID
 */
export const getDoctorVisitsByAdmissionController = async (req, res) => {
  try {
    const visits = await getDoctorVisitsByAdmission(req.params.admissionId);
    
    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    console.error('Error fetching doctor visits by admission:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create a new doctor visit
 */
export const createDoctorVisitController = async (req, res) => {
  try {
    // Generate ID if not provided
    if (!req.body.DoctorVisitId) {
      req.body.DoctorVisitId = await generateDoctorVisitId();
    }
    
    const result = await createDoctorVisit(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Doctor visit created successfully',
      data: { doctorVisitId: result.insertId }
    });
  } catch (error) {
    console.error('Error creating doctor visit:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a doctor visit
 */
export const updateDoctorVisitController = async (req, res) => {
  try {
    const result = await updateDoctorVisit(req.params.id, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor visit not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor visit updated successfully'
    });
  } catch (error) {
    console.error('Error updating doctor visit:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a doctor visit
 */
export const deleteDoctorVisitController = async (req, res) => {
  try {
    const result = await deleteDoctorVisit(req.params.id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor visit not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor visit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor visit:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};