import pool from '../config/db.js';

export const createHospital = async (hospitalData) => {
  const [result] = await pool.query(
    `INSERT INTO saas_registraction_table (
      srt_hospital_name, srt_hospital_logo, srt_hospital_email, 
      srt_hospital_type, srt_phone, srt_address, srt_city, 
      srt_state, srt_pin_code, srt_no_of_beds, 
      srt_emergency_available, srt_ambulance_contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      hospitalData.hospitalName,
      hospitalData.hospitalLogo,
      hospitalData.hospitalEmail,
      hospitalData.hospitalType,
      hospitalData.phone,
      hospitalData.address,
      hospitalData.city,
      hospitalData.state,
      hospitalData.pinCode,
      hospitalData.noOfBeds,
      hospitalData.emergencyAvailable,
      hospitalData.ambulanceContact
    ]
  );
  return result.insertId;
};

export const getHospitalById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM saas_registraction_table WHERE srt_id = ?',
    [id]
  );
  return rows[0];
};

export const getAllHospitals = async () => {
  const [rows] = await pool.query('SELECT * FROM saas_registraction_table');
  return rows;
};

export const updateHospital = async (id, hospitalData) => {
  const [result] = await pool.query(
    `UPDATE saas_registraction_table SET 
      srt_hospital_name = ?, 
      srt_hospital_logo = ?, 
      srt_hospital_email = ?, 
      srt_hospital_type = ?, 
      srt_phone = ?, 
      srt_address = ?, 
      srt_city = ?, 
      srt_state = ?, 
      srt_pin_code = ?, 
      srt_no_of_beds = ?, 
      srt_emergency_available = ?, 
      srt_ambulance_contact = ?,
      srt_status = ?,
      srt_is_verified = ?
    WHERE srt_id = ?`,
    [
      hospitalData.hospitalName,
      hospitalData.hospitalLogo,
      hospitalData.hospitalEmail,
      hospitalData.hospitalType,
      hospitalData.phone,
      hospitalData.address,
      hospitalData.city,
      hospitalData.state,
      hospitalData.pinCode,
      hospitalData.noOfBeds,
      hospitalData.emergencyAvailable,
      hospitalData.ambulanceContact,
      hospitalData.status,
      hospitalData.isVerified,
      id
    ]
  );
  return result.affectedRows;
};

export const deleteHospital = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM saas_registraction_table WHERE srt_id = ?',
    [id]
  );
  return result.affectedRows;
};