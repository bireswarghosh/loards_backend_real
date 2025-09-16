import db from '../../config/db.js';

/**
 * Get all subdepartments from the database
 * @returns {Promise<Array>} Array of subdepartment objects
 */
export const getAllSubDepartments = async () => {
  const [rows] = await db.query('SELECT * FROM subdepartment');
  return rows;
};

/**
 * Get a subdepartment by its ID
 * @param {number} id - SubDepartment ID
 * @returns {Promise<Object|null>} SubDepartment object or null if not found
 */
export const getSubDepartmentById = async (id) => {
  const [rows] = await db.query('SELECT * FROM subdepartment WHERE SubDepartmentId = ?', [id]);
  return rows[0] || null;
};

/**
 * Get subdepartments by department ID
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array>} Array of subdepartment objects
 */
export const getSubDepartmentsByDepartment = async (departmentId) => {
  const [rows] = await db.query('SELECT * FROM subdepartment WHERE DepartmentId = ?', [departmentId]);
  return rows;
};

/**
 * Create a new subdepartment
 * @param {Object} subDepartmentData - SubDepartment data
 * @returns {Promise<number>} ID of the newly created subdepartment
 */
export const createSubDepartment = async (subDepartmentData) => {
  const [result] = await db.query(
    'INSERT INTO subdepartment (SubDepartment, DepartmentId, SpRemTag) VALUES (?, ?, ?)',
    [subDepartmentData.SubDepartment, subDepartmentData.DepartmentId, subDepartmentData.SpRemTag || 0]
  );
  return result.insertId;
};

/**
 * Update an existing subdepartment
 * @param {number} id - SubDepartment ID to update
 * @param {Object} subDepartmentData - New subdepartment data
 * @returns {Promise<Object>} Result of the update operation
 */
export const updateSubDepartment = async (id, subDepartmentData) => {
  const [result] = await db.query(
    'UPDATE subdepartment SET SubDepartment = ?, DepartmentId = ?, SpRemTag = ? WHERE SubDepartmentId = ?',
    [
      subDepartmentData.SubDepartment, 
      subDepartmentData.DepartmentId, 
      subDepartmentData.SpRemTag || 0, 
      id
    ]
  );
  return result;
};

/**
 * Delete a subdepartment by its ID
 * @param {number} id - SubDepartment ID to delete
 * @returns {Promise<Object>} Result of the delete operation
 */
export const deleteSubDepartment = async (id) => {
  const [result] = await db.query('DELETE FROM subdepartment WHERE SubDepartmentId = ?', [id]);
  return result;
};