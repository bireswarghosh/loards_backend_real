import { 
  getAllSubDepartments, 
  getSubDepartmentById, 
  getSubDepartmentsByDepartment,
  createSubDepartment, 
  updateSubDepartment, 
  deleteSubDepartment 
} from '../../models/OPD/subdepartment.model.js';

/**
 * Get all subdepartments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllSubDepartmentsController = async (req, res) => {
  try {
    const subdepartments = await getAllSubDepartments();
    res.status(200).json({
      success: true,
      count: subdepartments.length,
      data: subdepartments
    });
  } catch (error) {
    console.error('Error fetching subdepartments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get subdepartment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSubDepartmentByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const subdepartment = await getSubDepartmentById(id);
    if (!subdepartment) {
      return res.status(404).json({ 
        success: false,
        message: 'SubDepartment not found'
      });
    }
    res.status(200).json({
      success: true,
      data: subdepartment
    });
  } catch (error) {
    console.error('Error fetching subdepartment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get subdepartments by department ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSubDepartmentsByDepartmentController = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const subdepartments = await getSubDepartmentsByDepartment(departmentId);
    res.status(200).json({
      success: true,
      count: subdepartments.length,
      data: subdepartments
    });
  } catch (error) {
    console.error('Error fetching subdepartments by department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create a new subdepartment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createSubDepartmentController = async (req, res) => {
  try {
    const subdepartmentId = await createSubDepartment(req.body);
    res.status(201).json({ 
      success: true,
      message: 'SubDepartment created successfully', 
      data: { subdepartmentId }
    });
  } catch (error) {
    console.error('Error creating subdepartment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update an existing subdepartment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateSubDepartmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateSubDepartment(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'SubDepartment not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'SubDepartment updated successfully'
    });
  } catch (error) {
    console.error('Error updating subdepartment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a subdepartment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteSubDepartmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteSubDepartment(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'SubDepartment not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'SubDepartment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subdepartment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};