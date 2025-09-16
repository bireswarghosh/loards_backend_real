import db from '../../config/db.js';

/**
 * Get all doctors with pagination and search
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of doctor objects
 */
export const getAllDoctors = async (options) => {
  const { limit, offset, search } = options;
  
  let query = 'SELECT * FROM doctormaster';
  const params = [];
  
  if (search) {
    query += ' WHERE Doctor LIKE ? OR Qualification LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY DoctorId DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Get total count of doctors
 * @param {string} search - Search term
 * @returns {Promise<number>} Total count
 */
export const getDoctorsCount = async (search) => {
  let query = 'SELECT COUNT(*) as total FROM doctormaster';
  const params = [];
  
  if (search) {
    query += ' WHERE Doctor LIKE ? OR Qualification LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  const [rows] = await db.query(query, params);
  return rows[0].total;
};

/**
 * Get a doctor by ID
 * @param {number} id - Doctor ID
 * @returns {Promise<Object|null>} Doctor object or null if not found
 */
export const getDoctorById = async (id) => {
  const [rows] = await db.query('SELECT * FROM doctormaster WHERE DoctorId = ?', [id]);
  return rows[0] || null;
};

/**
 * Get doctors by speciality/department ID
 * @param {number} specialityId - Speciality/Department ID
 * @returns {Promise<Array>} Array of doctor objects
 */
export const getDoctorsBySpeciality = async (specialityId) => {
  const [rows] = await db.query('SELECT * FROM doctormaster WHERE SpecialityId = ? ORDER BY Doctor', [specialityId]);
  return rows;
};

/**
 * Create a new doctor
 * @param {Object} doctorData - Doctor data
 * @returns {Promise<Object>} Result with insertId
 */
export const createDoctor = async (doctorData) => {
  const {
    Doctor, Add1, Add2, Add3, Phone, Fax, Identification,
    Qualification, IndoorRate, MExecutiveId, SpecialityId,
    Commission, FixedDiscount, MarkDoctorId, RMO, DrPr,
    IndoorYN, NotReq, Panel, CreateDate, RegistrationNo,
    Photo, Qualification2, Qualification3, Qualification4,
    areacode, ICURate, CABRate, SUITRate
  } = doctorData;
  
  const [result] = await db.query(
    `INSERT INTO doctormaster (
      Doctor, Add1, Add2, Add3, Phone, Fax, Identification,
      Qualification, IndoorRate, MExecutiveId, SpecialityId,
      Commission, FixedDiscount, MarkDoctorId, RMO, DrPr,
      IndoorYN, NotReq, Panel, CreateDate, RegistrationNo,
      Photo, Qualification2, Qualification3, Qualification4,
      areacode, ICURate, CABRate, SUITRate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Doctor || null,
      Add1 || null,
      Add2 || null,
      Add3 || null,
      Phone || null,
      Fax || null,
      Identification || null,
      Qualification || null,
      IndoorRate || 0,
      MExecutiveId || 0,
      SpecialityId || 0,
      Commission || null,
      FixedDiscount || 0,
      MarkDoctorId || 0,
      RMO || 'N',
      DrPr || null,
      IndoorYN || 'N',
      NotReq || 0,
      Panel || 0,
      CreateDate || new Date(),
      RegistrationNo || null,
      Photo || null,
      Qualification2 || null,
      Qualification3 || null,
      Qualification4 || null,
      areacode || 0,
      ICURate || 0,
      CABRate || 0,
      SUITRate || 0
    ]
  );
  
  return result;
};

/**
 * Update an existing doctor
 * @param {number} id - Doctor ID to update
 * @param {Object} doctorData - New doctor data
 * @returns {Promise<Object>} Result of the update operation
 */
export const updateDoctor = async (id, doctorData) => {
  // Build update query dynamically based on provided fields
  const updates = [];
  const values = [];
  
  Object.entries(doctorData).forEach(([key, value]) => {
    // Skip DoctorId as it's the primary key
    if (key !== 'DoctorId') {
      updates.push(`${key} = ?`);
      values.push(value === '' ? null : value);
    }
  });
  
  if (updates.length === 0) {
    throw new Error('No fields to update');
  }
  
  // Add doctorId to values array for WHERE clause
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE doctormaster SET ${updates.join(', ')} WHERE DoctorId = ?`,
    values
  );
  
  return result;
};

/**
 * Delete a doctor by ID
 * @param {number} id - Doctor ID to delete
 * @returns {Promise<Object>} Result of the delete operation
 */
export const deleteDoctor = async (id) => {
  const [result] = await db.query('DELETE FROM doctormaster WHERE DoctorId = ?', [id]);
  return result;
};