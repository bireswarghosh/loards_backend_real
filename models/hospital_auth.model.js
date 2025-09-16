import pool from '../config/db.js';

export const registerHospitalAuth = async (hospitalId, email, password) => {
  // সাধারণ পাসওয়ার্ড স্টোর করছি (প্রোডাকশনে bcrypt ব্যবহার করুন)
  
  const [result] = await pool.query(
    `INSERT INTO hospital_auth (hospital_id, email, password) 
     VALUES (?, ?, ?)`,
    [hospitalId, email, password]
  );
  
  return result.insertId;
};

export const findHospitalByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT ha.*, srt.* 
     FROM hospital_auth ha
     JOIN saas_registraction_table srt ON ha.hospital_id = srt.srt_id
     WHERE ha.email = ?`,
    [email]
  );
  
  return rows[0];
};

export const validatePassword = async (password, hashedPassword) => {
  // সাধারণ পাসওয়ার্ড যাচাই করছি (প্রোডাকশনে bcrypt ব্যবহার করুন)
  return password === hashedPassword;
};