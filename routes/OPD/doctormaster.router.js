
import express from 'express';
import { param, query } from 'express-validator';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import db from '../../config/db.js';
import { validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'doctors');

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, '..', '..', 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, '..', '..', 'uploads'));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doctor-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Apply middleware to protect all routes
router.use(authMiddleware);

// Custom error handler with detailed validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation error',
      errors: errors.array() 
    });
  }
  next();
};

// Get all doctors with pagination and search
router.get('/doctormaster', async (req, res) => {
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
    const dataQuery = `SELECT DoctorId, Doctor, Qualification, Phone, SpecialityId, IndoorYN, RMO, COALESCE(Status, "off") as Status FROM doctormaster${whereClause} ORDER BY DoctorId DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(dataQuery, [...params, parseInt(limit), parseInt(offset)]);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      total: total,
      data: rows,
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
});

// Get active doctors only
router.get('/doctormaster/active', async (req, res) => {
  try {
    const search = req.query.search || '';
    
    let query = 'SELECT DoctorId, Doctor, Qualification, Phone, SpecialityId, Photo, Email, Password, online_booking_app_booking_price, IndoorYN, RMO, COALESCE(Status, "off") as Status FROM doctormaster WHERE COALESCE(Status, "off") = "on"';
    const params = [];
    
    if (search) {
      query += ' AND (Doctor LIKE ? OR Qualification LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY DoctorId DESC';
    
    const [rows] = await db.query(query, params);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      total: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching active doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});



// Doctor login API
router.post('/doctormaster/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  try {
    // Only allow active doctors
    const [rows] = await db.query(
      'SELECT * FROM doctormaster WHERE Email = ? AND Password = ? AND COALESCE(Status, "off") = "on"',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive doctor' });
    }
    // Remove sensitive info if needed
    const doctor = rows[0];
    // doctor.Password = undefined; // Optionally hide password
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});



// Get doctors by department/speciality with pagination
router.get('/doctormaster/department/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM doctormaster WHERE SpecialityId = ?',
      [departmentId]
    );
    const total = countResult[0].total;
    
    // Get paginated data
    const [rows] = await db.query(
      'SELECT * FROM doctormaster WHERE SpecialityId = ? ORDER BY Doctor ASC LIMIT ? OFFSET ?',
      [departmentId, parseInt(limit), parseInt(offset)]
    );
    
    res.status(200).json({
      success: true,
      count: rows.length,
      total: total,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors by department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get doctor photo by ID
router.get('/doctormaster/:id/photo', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Photo FROM doctormaster WHERE DoctorId = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).send('Doctor not found');
    }
    
    // If we have binary data stored in the database
    if (rows[0].Photo) {
      // Set proper headers for image data
      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'no-cache, no-store');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      // Convert buffer to base64 and send as binary
      const buffer = Buffer.from(rows[0].Photo);
      return res.send(buffer);
    }
    
    return res.status(404).send('Photo not found');
  } catch (error) {
    console.error('Error fetching doctor photo:', error);
    res.status(500).send('Error fetching photo');
  }
});

// Get doctor by ID
router.get('/doctormaster/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctormaster WHERE DoctorId = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Don't send photo in JSON response
    const doctorData = { ...rows[0] };
    
    // Check if photo exists before deleting it
    const hasPhoto = doctorData.Photo ? true : false;
    console.log('Doctor has photo:', hasPhoto);
    
    if (doctorData.Photo) {
      delete doctorData.Photo;
    }
    
    // Always add photo URL and hasPhoto flag
    doctorData.photoUrl = `/api/v1/doctormaster/${req.params.id}/photo`;
    doctorData.hasPhoto = hasPhoto;
    
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
});

// Create new doctor with file upload
router.post('/doctormaster', upload.single('Photo'), async (req, res) => {
  try {
    const {
      Doctor, Add1, Add2, Add3, Phone, Fax, Identification,
      Qualification, IndoorRate, MExecutiveId, SpecialityId,
      Commission, FixedDiscount, MarkDoctorId, RMO, DrPr,
      IndoorYN, NotReq, Panel, CreateDate, RegistrationNo,
      Qualification2, Qualification3, Qualification4,
      areacode, ICURate, CABRate, SUITRate, VisitDays,
      online_booking_app_booking_price
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
      SUITRate: SUITRate || 0,
      online_booking_app_booking_price: online_booking_app_booking_price || 0
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
      // Read the file and store as binary data in the Photo column
      const photoBuffer = fs.readFileSync(req.file.path);
      insertData.Photo = photoBuffer;
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
});

// Update doctor with file upload
router.put('/doctormaster/:id', upload.single('Photo'), async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log('Updating doctor ID:', doctorId);
    console.log('Update data:', req.body);
    
    // Check if doctor exists
    const [checkResult] = await db.query('SELECT 1 FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    if (checkResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
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
      // Read the file and store as binary data in the Photo column
      const photoBuffer = fs.readFileSync(req.file.path);
      updates.push('Photo = ?');
      values.push(photoBuffer);
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
        photoPath: req.file ? req.file.path : null
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
});

// Toggle doctor status
router.put('/doctormaster/:id/status', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { status } = req.body;
    
    // Check if doctor exists
    const [checkResult] = await db.query('SELECT DoctorId FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    if (checkResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Try to add Status column if it doesn't exist
    try {
      await db.query('ALTER TABLE doctormaster ADD COLUMN Status VARCHAR(10) DEFAULT "off"');
    } catch (alterError) {
      // Column might already exist, ignore error
    }
    
    // Update doctor status in database
    await db.query('UPDATE doctormaster SET Status = ? WHERE DoctorId = ?', [status, doctorId]);
    
    res.status(200).json({
      success: true,
      message: `Doctor status updated to ${status}`,
      data: { doctorId, status }
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get doctor rates by doctor ID
router.get('/doctormaster/:id/rates', async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    const [rows] = await db.query(`
      SELECT 
        vr.id,
        vr.VisitTypeId,
        vt.VisitType,
        vr.Rate,
        vr.ServiceCh,
        vr.GroupA,
        vr.GroupB,
        vr.GroupC,
        vr.GroupD
      FROM vrate vr
      JOIN visittype vt ON vr.VisitTypeId = vt.VisitTypeId
      WHERE vr.DoctorId = ?
    `, [doctorId]);
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching doctor rates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all visit types
router.get('/visittype', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT VisitTypeId, VisitType FROM visittype ORDER BY VisitType');
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching visit types:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Save doctor rates
router.post('/doctormaster/:id/rates', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { rates } = req.body;
    
    // Delete existing rates for this doctor
    await db.query('DELETE FROM vrate WHERE DoctorId = ?', [doctorId]);
    
    // Insert new rates
    for (const rate of rates) {
      if (rate.Rate || rate.ServiceCh || rate.GroupA || rate.GroupB || rate.GroupC || rate.GroupD) {
        await db.query(`
          INSERT INTO vrate (DoctorId, VisitTypeId, Rate, ServiceCh, GroupA, GroupB, GroupC, GroupD)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          doctorId,
          rate.VisitTypeId,
          rate.Rate || 0,
          rate.ServiceCh || 0,
          rate.GroupA || 0,
          rate.GroupB || 0,
          rate.GroupC || 0,
          rate.GroupD || 0
        ]);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor rates saved successfully'
    });
  } catch (error) {
    console.error('Error saving doctor rates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete doctor
router.delete('/doctormaster/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Check if doctor exists
    const [checkResult] = await db.query('SELECT 1 FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    if (checkResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const [result] = await db.query('DELETE FROM doctormaster WHERE DoctorId = ?', [doctorId]);
    
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
});

export default router;