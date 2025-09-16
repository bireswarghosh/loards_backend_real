import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../../config/db.js';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all doctors with pagination and search
 */
export const getAllDoctorsController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const params = [];
    
    if (search) {
      whereClause = ' WHERE Doctor LIKE ? OR Qualification LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM doctormaster${whereClause}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;
    
    // Get paginated data
    const dataQuery = `SELECT DoctorId, Doctor, Qualification, Phone, SpecialityId, IndoorYN, RMO, PhotoPath FROM doctormaster${whereClause} ORDER BY DoctorId DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(dataQuery, [...params, parseInt(limit), parseInt(offset)]);
    
    // Add photo URL to each doctor
    const doctors = rows.map(doctor => {
      const doctorWithUrl = {...doctor};
      if (doctorWithUrl.PhotoPath) {
        doctorWithUrl.photoUrl = `/api/v1/doctormaster/${doctor.DoctorId}/photo`;
      }
      return doctorWithUrl;
    });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      total: total,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctor by ID
 */
export const getDoctorByIdController = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctormaster WHERE DoctorId = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Don't send photo binary data in JSON response
    const doctorData = { ...rows[0] };
    if (doctorData.Photo) {
      doctorData.hasPhoto = true;
      delete doctorData.Photo;
    }
    
    // Add photo URL if available
    if (doctorData.PhotoPath) {
      doctorData.photoUrl = `/api/v1/doctormaster/${req.params.id}/photo`;
    }
    
    // Handle days data if present
    if (doctorData.VisitDays) {
      try {
        doctorData.VisitDays = JSON.parse(doctorData.VisitDays);
      } catch (e) {
        doctorData.VisitDays = [];
      }
    } else {
      doctorData.VisitDays = [];
    }
    
    res.status(200).json({
      success: true,
      data: doctorData
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get doctor photo by ID
 */
export const getDoctorPhotoController = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Photo, PhotoPath FROM doctormaster WHERE DoctorId = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).send('Doctor not found');
    }
    
    // If we have a file path stored, send that file
    if (rows[0].PhotoPath) {
      const absolutePath = path.resolve(__dirname, '..', '..', rows[0].PhotoPath.replace('./', ''));
      if (fs.existsSync(absolutePath)) {
        return res.sendFile(absolutePath);
      }
    }
    
    // If we have binary data stored in the database
    if (rows[0].Photo) {
      res.set('Content-Type', 'image/jpeg');
      return res.send(rows[0].Photo);
    }
    
    return res.status(404).send('Photo not found');
  } catch (error) {
    console.error('Error fetching doctor photo:', error);
    res.status(500).send('Error fetching photo');
  }
};

/**
 * Get doctors by speciality
 */
export const getDoctorsBySpecialityController = async (req, res) => {
  try {
    const { specialityId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM doctormaster WHERE SpecialityId = ?',
      [specialityId]
    );
    const total = countResult[0].total;
    
    // Get paginated data
    const [rows] = await db.query(
      'SELECT DoctorId, Doctor, Qualification, Phone, SpecialityId, IndoorYN, RMO, PhotoPath FROM doctormaster WHERE SpecialityId = ? ORDER BY Doctor ASC LIMIT ? OFFSET ?',
      [specialityId, parseInt(limit), parseInt(offset)]
    );
    
    // Add photo URL to each doctor
    const doctors = rows.map(doctor => {
      const doctorWithUrl = {...doctor};
      if (doctorWithUrl.PhotoPath) {
        doctorWithUrl.photoUrl = `/api/v1/doctormaster/${doctor.DoctorId}/photo`;
      }
      return doctorWithUrl;
    });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      total: total,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors by speciality:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create a new doctor
 */
export const createDoctorController = async (req, res) => {
  try {
    const {
      Doctor, Add1, Add2, Add3, Phone, Fax, Identification,
      Qualification, IndoorRate, MExecutiveId, SpecialityId,
      Commission, FixedDiscount, MarkDoctorId, RMO, DrPr,
      IndoorYN, NotReq, Panel, CreateDate, RegistrationNo,
      Qualification2, Qualification3, Qualification4,
      areacode, ICURate, CABRate, SUITRate, VisitDays
    } = req.body;
    
    // Validate Doctor name
    if (!Doctor || Doctor.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Doctor name is required'
      });
    }
    
    // Prepare data for insertion
    const insertData = {
      Doctor: Doctor || null,
      Add1: Add1 || null,
      Add2: Add2 || null,
      Add3: Add3 || null,
      Phone: Phone || null,
      Fax: Fax || null,
      Identification: Identification || null,
      Qualification: Qualification || null,
      IndoorRate: IndoorRate || 0,
      MExecutiveId: MExecutiveId || 0,
      SpecialityId: SpecialityId || 0,
      Commission: Commission || null,
      FixedDiscount: FixedDiscount || 0,
      MarkDoctorId: MarkDoctorId || 0,
      RMO: RMO || 'N',
      DrPr: DrPr || null,
      IndoorYN: IndoorYN || 'N',
      NotReq: NotReq || 0,
      Panel: Panel || 0,
      CreateDate: CreateDate || new Date(),
      RegistrationNo: RegistrationNo || null,
      Qualification2: Qualification2 || null,
      Qualification3: Qualification3 || null,
      Qualification4: Qualification4 || null,
      areacode: areacode || 0,
      ICURate: ICURate || 0,
      CABRate: CABRate || 0,
      SUITRate: SUITRate || 0
    };
    
    // Handle visit days if provided
    if (VisitDays) {
      try {
        // Store as JSON string if it's an array
        if (Array.isArray(JSON.parse(VisitDays))) {
          insertData.VisitDays = VisitDays;
        }
      } catch (e) {
        console.error('Invalid VisitDays format:', e);
      }
    }
    
    // Handle photo upload
    if (req.file) {
      insertData.PhotoPath = req.file.path.replace(/\\/g, '/');
    }
    
    // Build the SQL query dynamically
    const fields = Object.keys(insertData).join(', ');
    const placeholders = Object.keys(insertData).map(() => '?').join(', ');
    const values = Object.values(insertData);
    
    const [result] = await db.query(
      `INSERT INTO doctormaster (${fields}) VALUES (${placeholders})`,
      values
    );
    
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { 
        doctorId: result.insertId,
        photoPath: req.file ? req.file.path : null
      }
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update an existing doctor
 */
export const updateDoctorController = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Check if doctor exists
    const [checkResult] = await db.query('SELECT PhotoPath FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    if (checkResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const oldPhotoPath = checkResult[0].PhotoPath;
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    Object.entries(req.body).forEach(([key, value]) => {
      // Skip DoctorId as it's the primary key and Photo as it's handled separately
      if (key !== 'DoctorId' && key !== 'Photo') {
        // Special handling for VisitDays
        if (key === 'VisitDays' && value) {
          try {
            // Ensure it's valid JSON before storing
            JSON.parse(value);
            updates.push(`${key} = ?`);
            values.push(value);
          } catch (e) {
            console.error('Invalid VisitDays format:', e);
          }
        } else {
          updates.push(`${key} = ?`);
          values.push(value === '' ? null : value);
        }
      }
    });
    
    // Handle photo separately if provided
    if (req.file) {
      updates.push('PhotoPath = ?');
      values.push(req.file.path.replace(/\\/g, '/'));
      
      // Delete old photo file if exists
      if (oldPhotoPath) {
        const oldAbsolutePath = path.resolve(__dirname, '..', '..', oldPhotoPath.replace('./', ''));
        if (fs.existsSync(oldAbsolutePath)) {
          fs.unlinkSync(oldAbsolutePath);
        }
      }
    }
    
    if (updates.length === 0 && !req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No fields to update'
      });
    }
    
    // Add doctorId to values array for WHERE clause
    values.push(doctorId);
    
    const [result] = await db.query(
      `UPDATE doctormaster SET ${updates.join(', ')} WHERE DoctorId = ?`,
      values
    );
    
    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: { 
        affectedRows: result.affectedRows,
        doctorId: doctorId,
        photoUrl: req.file ? `/api/v1/doctormaster/${doctorId}/photo` : null
      }
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a doctor
 */
export const deleteDoctorController = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Get photo path before deleting
    const [photoResult] = await db.query('SELECT PhotoPath FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    
    if (photoResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Delete the doctor record
    const [result] = await db.query('DELETE FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    
    // Delete photo file if exists
    if (photoResult[0].PhotoPath) {
      const absolutePath = path.resolve(__dirname, '..', '..', photoResult[0].PhotoPath.replace('./', ''));
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
      data: { affectedRows: result.affectedRows }
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};