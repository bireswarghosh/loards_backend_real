import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/ivf-photos/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create IVF biodata
router.post('/ivf-biodata', upload.fields([
  { name: 'husbandPhoto', maxCount: 1 },
  { name: 'wifePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      IVFNo, Type, Name, Age, Add1, Add2, Add3, Complexion, EyeColour, BloodGroup,
      Height, Weight, Document, Occupation, PhoneNo, WName, WAge, WAdd1, WAdd2, WAdd3,
      WComplexion, WEyeColour, WBloodGroup, WHeight, WWeight, WDocument, WOccupation,
      WPhoneNo, HusbandName, AgentName
    } = req.body;

    const IVFId = `IVF${Date.now()}`;
    const IVFDate = new Date();

    const query = `
      INSERT INTO ivfbiodata (
        IVFId, IVFNo, IVFDate, Type, Name, Age, Add1, Add2, Add3, Complexion, EyeColour,
        BloodGroup, Height, Weight, Document, Occupation, PhoneNo, WName, WAge, WAdd1,
        WAdd2, WAdd3, WComplexion, WEyeColour, WBloodGroup, WHeight, WWeight, WDocument,
        WOccupation, WPhoneNo, HusbandName, AgentName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      IVFId, IVFNo || null, IVFDate, Type || 'PATIENT', Name || null, Age || null, Add1 || null, Add2 || null, Add3 || null, Complexion || null, EyeColour || null,
      BloodGroup || null, Height || null, Weight || null, Document || null, Occupation || null, PhoneNo || null, WName || null, WAge || null, WAdd1 || null,
      WAdd2 || null, WAdd3 || null, WComplexion || null, WEyeColour || null, WBloodGroup || null, WHeight || null, WWeight || null, WDocument || null,
      WOccupation || null, WPhoneNo || null, HusbandName || null, AgentName || null
    ];

    await db.execute(query, values);

    res.status(201).json({
      success: true,
      message: 'IVF biodata created successfully',
      data: { IVFId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all IVF biodata
router.get('/ivf-biodata', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ivfbiodata ORDER BY IVFDate DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get IVF biodata by ID
router.get('/ivf-biodata/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ivfbiodata WHERE IVFId = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'IVF biodata not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add blood test
router.post('/blood-test', async (req, res) => {
  try {
    const { IVFId, Result } = req.body;
    const TestDate = new Date();

    const query = 'INSERT INTO ivfbloodtestdtl (TestDate, Result, IVFId) VALUES (?, ?, ?)';
    await db.execute(query, [TestDate, Result || null, IVFId || null]);

    res.status(201).json({ success: true, message: 'Blood test added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get blood tests for IVF ID
router.get('/blood-test/:ivfId', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ivfbloodtestdtl WHERE IVFId = ?', [req.params.ivfId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all blood tests
router.get('/blood-test-all', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ivfbloodtestdtl ORDER BY TestDate DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get blood test headers
router.get('/blood-test-headers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ivfbloodtesthdr');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add blood test header
router.post('/blood-test-headers', async (req, res) => {
  try {
    const { TestCode, TestName } = req.body;
    const query = 'INSERT INTO ivfbloodtesthdr (TestCode, TestName) VALUES (?, ?)';
    await db.execute(query, [TestCode || null, TestName || null]);
    res.status(201).json({ success: true, message: 'Blood test header added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update blood test header
router.put('/blood-test-headers/:id', async (req, res) => {
  try {
    const { TestCode, TestName } = req.body;
    const query = 'UPDATE ivfbloodtesthdr SET TestCode = ?, TestName = ? WHERE TestId = ?';
    await db.execute(query, [TestCode || null, TestName || null, req.params.id]);
    res.json({ success: true, message: 'Blood test header updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete blood test header
router.delete('/blood-test-headers/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM ivfbloodtesthdr WHERE TestId = ?', [req.params.id]);
    res.json({ success: true, message: 'Blood test header deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update IVF biodata
router.put('/ivf-biodata/:id', async (req, res) => {
  try {
    const {
      IVFNo, Type, Name, Age, Add1, Add2, Add3, Complexion, EyeColour, BloodGroup,
      Height, Weight, Document, Occupation, PhoneNo, WName, WAge, WAdd1, WAdd2, WAdd3,
      WComplexion, WEyeColour, WBloodGroup, WHeight, WWeight, WDocument, WOccupation,
      WPhoneNo, HusbandName, AgentName
    } = req.body;

    const query = `
      UPDATE ivfbiodata SET
        IVFNo = ?, Type = ?, Name = ?, Age = ?, Add1 = ?, Add2 = ?, Add3 = ?, Complexion = ?, EyeColour = ?,
        BloodGroup = ?, Height = ?, Weight = ?, Document = ?, Occupation = ?, PhoneNo = ?, WName = ?, WAge = ?, WAdd1 = ?,
        WAdd2 = ?, WAdd3 = ?, WComplexion = ?, WEyeColour = ?, WBloodGroup = ?, WHeight = ?, WWeight = ?, WDocument = ?,
        WOccupation = ?, WPhoneNo = ?, HusbandName = ?, AgentName = ?
      WHERE IVFId = ?
    `;

    const values = [
      IVFNo || null, Type || 'PATIENT', Name || null, Age || null, Add1 || null, Add2 || null, Add3 || null, Complexion || null, EyeColour || null,
      BloodGroup || null, Height || null, Weight || null, Document || null, Occupation || null, PhoneNo || null, WName || null, WAge || null, WAdd1 || null,
      WAdd2 || null, WAdd3 || null, WComplexion || null, WEyeColour || null, WBloodGroup || null, WHeight || null, WWeight || null, WDocument || null,
      WOccupation || null, WPhoneNo || null, HusbandName || null, AgentName || null, req.params.id
    ];

    await db.execute(query, values);
    res.json({ success: true, message: 'IVF biodata updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete IVF biodata
router.delete('/ivf-biodata/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM ivfbiodata WHERE IVFId = ?', [req.params.id]);
    res.json({ success: true, message: 'IVF biodata deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update blood test
router.put('/blood-test/:id', async (req, res) => {
  try {
    const { Result } = req.body;
    const query = 'UPDATE ivfbloodtestdtl SET Result = ? WHERE TestId = ?';
    await db.execute(query, [Result || null, req.params.id]);
    res.json({ success: true, message: 'Blood test updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete blood test
router.delete('/blood-test/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM ivfbloodtestdtl WHERE TestId = ?', [req.params.id]);
    res.json({ success: true, message: 'Blood test deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;