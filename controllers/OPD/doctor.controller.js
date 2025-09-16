import { 
  getAllDoctors, 
  getDoctorById,
  getDoctorsBySpeciality,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsCount
} from '../../models/OPD/doctormaster.model.js';

/**
 * Get all doctors with pagination and search
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllDoctorsController = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 100,
      offset: parseInt(req.query.offset) || 0,
      search: req.query.search || ''
    };
    
    const doctors = await getAllDoctors(options);
    const total = await getDoctorsCount(options.search);
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      total: total,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctor by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDoctorByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await getDoctorById(id);
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctors by department/speciality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDoctorsByDepartmentController = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const doctors = await getDoctorsBySpeciality(departmentId);
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors by department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
    
  }
};

/**
 * Create a new doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createDoctorController = async (req, res) => {
  try {
    const result = await createDoctor(req.body);
    res.status(201).json({ 
      success: true,
      message: 'Doctor created successfully', 
      data: { doctorId: result.insertId }
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update an existing doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateDoctorController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateDoctor(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Doctor updated successfully'
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteDoctorController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteDoctor(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};