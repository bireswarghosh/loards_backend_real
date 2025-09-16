import db from '../../config/db.js';

/**
 * Get all specialities with optional caching
 * @returns {Promise<Array>} Array of speciality objects
 */
export const getAllSpecialities = async () => {
  const [rows] = await db.query('SELECT * FROM speciality ORDER BY Speciality');
  return rows;
};

/**
 * Get a speciality by ID
 * @param {number} id - Speciality ID
 * @returns {Promise<Object|null>} Speciality object or null if not found
 */
export const getSpecialityById = async (id) => {
  const [rows] = await db.query('SELECT * FROM speciality WHERE SpecialityId = ?', [id]);
  return rows[0] || null;
};

/**
 * Create a new speciality
 * @param {Object} data - Speciality data
 * @returns {Promise<Object>} Result with insertId
 */
export const createSpeciality = async (data) => {
  const { Speciality, Code, OT } = data;
  const [result] = await db.query(
    'INSERT INTO speciality (Speciality, Code, OT) VALUES (?, ?, ?)',
    [Speciality, Code || null, OT || 'N']
  );
  return { insertId: result.insertId };
};

/**
 * Update a speciality
 * @param {number} id - Speciality ID
 * @param {Object} data - Updated speciality data
 * @returns {Promise<Object>} Result of update operation
 */
export const updateSpeciality = async (id, data) => {
  const { Speciality, Code, OT } = data;
  const [result] = await db.query(
    'UPDATE speciality SET Speciality = ?, Code = ?, OT = ? WHERE SpecialityId = ?',
    [Speciality, Code || null, OT || 'N', id]
  );
  return result;
};

/**
 * Delete a speciality
 * @param {number} id - Speciality ID
 * @returns {Promise<Object>} Result of delete operation
 */
export const deleteSpeciality = async (id) => {
  const [result] = await db.query('DELETE FROM speciality WHERE SpecialityId = ?', [id]);
  return result;
};