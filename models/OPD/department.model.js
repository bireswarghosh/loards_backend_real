import db from '../../config/db.js';

/**
 * Get all departments from the database
 * @returns {Promise<Array>} Array of department objects
 */
export const getAllDepartments = async () => {
  const [rows] = await db.query('SELECT * FROM department');
  return rows;
};

/**
 * Get a department by its ID
 * @param {number} id - Department ID
 * @returns {Promise<Object|null>} Department object or null if not found
 */
export const getDepartmentById = async (id) => {
  const [rows] = await db.query('SELECT * FROM department WHERE DepartmentId = ?', [id]);
  return rows[0] || null;
};

/**
 * Create a new department
 * @param {Object} departmentData - Department data
 * @returns {Promise<number>} ID of the newly created department
 */
export const createDepartment = async (departmentData) => {
  const [result] = await db.query(
    'INSERT INTO department (Department, DepShName, BP) VALUES (?, ?, ?)',
    [departmentData.Department, departmentData.DepShName, departmentData.BP || 0]
  );
  return result.insertId;
};

/**
 * Update an existing department
 * @param {number} id - Department ID to update
 * @param {Object} departmentData - New department data
 * @returns {Promise<Object>} Result of the update operation
 */
export const updateDepartment = async (id, departmentData) => {
  const [result] = await db.query(
    'UPDATE department SET Department = ?, DepShName = ?, BP = ? WHERE DepartmentId = ?',
    [departmentData.Department, departmentData.DepShName, departmentData.BP || 0, id]
  );
  return result;
};

/**
 * Delete a department by its ID
 * @param {number} id - Department ID to delete
 * @returns {Promise<Object>} Result of the delete operation
 */
export const deleteDepartment = async (id) => {
  const [result] = await db.query('DELETE FROM department WHERE DepartmentId = ?', [id]);
  return result;
};