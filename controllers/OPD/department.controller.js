import { 
  getAllDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../../models/OPD/department.model.js';

/**
 * Get all departments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllDepartmentsController = async (req, res) => {
  try {
    const departments = await getAllDepartments();
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get department by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDepartmentByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ 
        success: false,
        message: 'Department not found'
      });
    }
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create a new department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createDepartmentController = async (req, res) => {
  try {
    const departmentId = await createDepartment(req.body);
    res.status(201).json({ 
      success: true,
      message: 'Department created successfully', 
      data: { departmentId }
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update an existing department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateDepartmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateDepartment(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Department not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Department updated successfully'
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteDepartmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteDepartment(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Department not found'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};