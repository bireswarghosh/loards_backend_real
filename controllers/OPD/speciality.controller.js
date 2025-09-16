import { 
  getAllSpecialities, 
  getSpecialityById, 
  createSpeciality, 
  updateSpeciality, 
  deleteSpeciality 
} from '../../models/OPD/speciality.model.js';

/**
 * Get all specialities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllSpecialitiesController = async (req, res) => {
  try {
    const specialities = await getAllSpecialities();
    
    // Set cache headers for better performance
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    
    res.status(200).json({
      success: true,
      count: specialities.length,
      data: specialities
    });
  } catch (error) {
    console.error('Error fetching specialities:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get speciality by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSpecialityByIdController = async (req, res) => {
  try {
    const speciality = await getSpecialityById(req.params.id);
    
    if (!speciality) {
      return res.status(404).json({ 
        success: false,
        message: 'Speciality not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: speciality
    });
  } catch (error) {
    console.error('Error fetching speciality:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new speciality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createSpecialityController = async (req, res) => {
  try {
    const result = await createSpeciality(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Speciality created successfully',
      data: { specialityId: result.insertId }
    });
  } catch (error) {
    console.error('Error creating speciality:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update a speciality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateSpecialityController = async (req, res) => {
  try {
    const result = await updateSpeciality(req.params.id, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Speciality not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Speciality updated successfully'
    });
  } catch (error) {
    console.error('Error updating speciality:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete a speciality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteSpecialityController = async (req, res) => {
  try {
    const result = await deleteSpeciality(req.params.id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Speciality not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Speciality deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting speciality:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};