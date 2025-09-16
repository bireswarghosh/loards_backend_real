import db from '../../config/db.js';

/**
 * Get all doctor visits with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of doctor visit objects
 */
export const getAllDoctorVisits = async (options = {}) => {
  const { limit = 100, offset = 0, admissionId = null } = options;
  
  let query = 'SELECT dv.*, d.Doctor FROM doctorvisit dv LEFT JOIN doctormaster d ON dv.DoctorId = d.DoctorId';
  const params = [];
  
  if (admissionId) {
    query += ' WHERE dv.AdmitionId = ?';
    params.push(admissionId);
  }
  
  query += ' ORDER BY dv.VisitDate DESC, dv.VisitTime DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Get doctor visit by ID
 * @param {string} id - Doctor visit ID
 * @returns {Promise<Object|null>} Doctor visit object or null if not found
 */
export const getDoctorVisitById = async (id) => {
  const [rows] = await db.query(
    'SELECT dv.*, d.Doctor FROM doctorvisit dv LEFT JOIN doctormaster d ON dv.DoctorId = d.DoctorId WHERE dv.DoctorVisitId = ?', 
    [id]
  );
  return rows[0] || null;
};

/**
 * Get doctor visits by admission ID
 * @param {string} admissionId - Admission ID
 * @returns {Promise<Array>} Array of doctor visit objects
 */
export const getDoctorVisitsByAdmission = async (admissionId) => {
  const [rows] = await db.query(
    'SELECT dv.*, d.Doctor FROM doctorvisit dv LEFT JOIN doctormaster d ON dv.DoctorId = d.DoctorId WHERE dv.AdmitionId = ? ORDER BY dv.VisitDate DESC, dv.VisitTime DESC', 
    [admissionId]
  );
  return rows;
};

/**
 * Create a new doctor visit
 * @param {Object} visitData - Doctor visit data
 * @returns {Promise<Object>} Result with insertId
 */
export const createDoctorVisit = async (visitData) => {
  const {
    DoctorVisitId, AdmitionId, DoctorId, Rate, VisitDate, VisitTime,
    UserId, NoOfVisit, Amount, TypeOfVisit, Adv1, Adv2,
    payAmount, paidAmount, paiddate, Clearing, VUNIT, cashno, Package
  } = visitData;
  
  const [result] = await db.query(
    `INSERT INTO doctorvisit (
      DoctorVisitId, AdmitionId, DoctorId, Rate, VisitDate, VisitTime,
      UserId, NoOfVisit, Amount, TypeOfVisit, Adv1, Adv2,
      payAmount, paidAmount, paiddate, Clearing, VUNIT, cashno, Package
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      DoctorVisitId,
      AdmitionId || null,
      DoctorId || null,
      Rate || 0,
      VisitDate || new Date(),
      VisitTime || null,
      UserId || null,
      NoOfVisit || 0,
      Amount || 0,
      TypeOfVisit || 'DOCTOR VISIT',
      Adv1 || null,
      Adv2 || null,
      payAmount || 0,
      paidAmount || 0,
      paiddate || '1900-01-01 00:00:00',
      Clearing || 'N',
      VUNIT || '/VISIT',
      cashno || null,
      Package || 'N'
    ]
  );
  
  return { insertId: DoctorVisitId };
};

/**
 * Update a doctor visit
 * @param {string} id - Doctor visit ID
 * @param {Object} visitData - Updated doctor visit data
 * @returns {Promise<Object>} Result of update operation
 */
export const updateDoctorVisit = async (id, visitData) => {
  // Build update query dynamically based on provided fields
  const updates = [];
  const values = [];
  
  Object.entries(visitData).forEach(([key, value]) => {
    // Skip DoctorVisitId as it's the primary key
    if (key !== 'DoctorVisitId') {
      updates.push(`${key} = ?`);
      values.push(value === '' ? null : value);
    }
  });
  
  if (updates.length === 0) {
    throw new Error('No fields to update');
  }
  
  // Add id to values array for WHERE clause
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE doctorvisit SET ${updates.join(', ')} WHERE DoctorVisitId = ?`,
    values
  );
  
  return result;
};

/**
 * Delete a doctor visit
 * @param {string} id - Doctor visit ID
 * @returns {Promise<Object>} Result of delete operation
 */
export const deleteDoctorVisit = async (id) => {
  const [result] = await db.query('DELETE FROM doctorvisit WHERE DoctorVisitId = ?', [id]);
  return result;
};

/**
 * Generate a new doctor visit ID
 * @returns {Promise<string>} Generated doctor visit ID
 */
export const generateDoctorVisitId = async () => {
  // Get current financial year
  const date = new Date();
  let startYear, endYear;
  
  // Financial year is from April to March
  if (date.getMonth() >= 3) { // April (3) onwards
    startYear = date.getFullYear();
    endYear = date.getFullYear() + 1;
  } else { // January to March
    startYear = date.getFullYear() - 1;
    endYear = date.getFullYear();
  }
  
  // Format as YY-YY (e.g., 23-24)
  const financialYear = `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
  
  // Get the last visit ID for this financial year
  const [rows] = await db.query(
    'SELECT DoctorVisitId FROM doctorvisit WHERE DoctorVisitId LIKE ? ORDER BY DoctorVisitId DESC LIMIT 1',
    [`%/${financialYear}`]
  );
  
  let nextNumber = 1;
  
  if (rows.length > 0) {
    // Extract the numeric part before the slash
    const lastId = rows[0].DoctorVisitId;
    const lastNumber = parseInt(lastId.split('/')[0], 10);
    nextNumber = lastNumber + 1;
  }
  
  // Pad with zeros to 6 digits
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  
  // Combine to create the final ID
  return `${paddedNumber}/${financialYear}`;
};