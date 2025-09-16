import db from '../../config/db.js';

/**
 * Get all visit days for a doctor
 * @param {number} doctorId - Doctor ID
 * @returns {Promise<Array>} Array of visit day objects
 */
export const getDoctorVisitDays = async (doctorId) => {
  const [rows] = await db.query(
    'SELECT * FROM doctorvisitdt WHERE DoctorId = ? ORDER BY VisitOurId',
    [doctorId]
  );
  return rows;
};

/**
 * Add a visit day for a doctor
 * @param {Object} data - Visit day data
 * @returns {Promise<Object>} Result of the insert operation
 */
export const addDoctorVisitDay = async (data) => {
  const { DoctorId, VDay, VisitOurId } = data;
  
  const [result] = await db.query(
    'INSERT INTO doctorvisitdt (DoctorId, VDay, VisitOurId) VALUES (?, ?, ?)',
    [DoctorId, VDay, VisitOurId || 1]
  );
  
  return result;
};

/**
 * Delete a visit day for a doctor
 * @param {number} doctorId - Doctor ID
 * @param {string} day - Day of the week (e.g., MON, TUE)
 * @returns {Promise<Object>} Result of the delete operation
 */
export const deleteDoctorVisitDay = async (doctorId, day) => {
  const [result] = await db.query(
    'DELETE FROM doctorvisitdt WHERE DoctorId = ? AND VDay = ?',
    [doctorId, day]
  );
  
  return result;
};

/**
 * Update doctor visit days (delete all and add new ones)
 * @param {number} doctorId - Doctor ID
 * @param {Array} days - Array of day strings (e.g., ['MON', 'WED', 'FRI'])
 * @returns {Promise<Object>} Result of the operation
 */
export const updateDoctorVisitDays = async (doctorId, days) => {
  // Start a transaction
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Delete all existing visit days for this doctor
    await connection.query('DELETE FROM doctorvisitdt WHERE DoctorId = ?', [doctorId]);
    
    // Add new visit days
    if (days && days.length > 0) {
      const values = days.map(day => [doctorId, day, 1]);
      await connection.query(
        'INSERT INTO doctorvisitdt (DoctorId, VDay, VisitOurId) VALUES ?',
        [values]
      );
    }
    
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};