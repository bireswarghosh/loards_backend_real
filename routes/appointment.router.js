import express from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../prisma/client.js';

const router = express.Router();

// Configure multer for prescription file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Create appointment (patient)
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, appointment_type, date, time, problem, payment_method, transaction_id, booking_price } = req.body;
  if (!patient_id || !doctor_id || !appointment_type || !date || !time) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  try {
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_appointments
      (patient_id, doctor_id, appointment_type, date, time, problem, payment_method, transaction_id, booking_price)
      VALUES (${patient_id}, ${doctor_id}, ${appointment_type}, ${date}, ${time}, ${problem || null}, ${payment_method || 'cash'}, ${transaction_id || null}, ${booking_price ? parseFloat(booking_price) : 0})
    `;
    res.status(201).json({ success: true, message: 'Appointment created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error: err.message });
  }
});

// Get appointments for patient
router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    const appointments = await prisma.$queryRaw`
      SELECT a.*, d.Doctor as doctor_name
      FROM appointment_booking_app_appointments a
      JOIN doctormaster d ON a.doctor_id = d.DoctorId
      WHERE a.patient_id = ${parseInt(patientId)}
      ORDER BY a.date DESC, a.time DESC
    `;
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get appointments', error: err.message });
  }
});

// Get appointments for doctor
router.get('/doctor/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    const appointments = await prisma.$queryRaw`
      SELECT a.*, p.fullName as patient_name
      FROM appointment_booking_app_appointments a
      JOIN appointment_booking_app_patient p ON a.patient_id = p.id
      WHERE a.doctor_id = ${parseInt(doctorId)}
      ORDER BY a.date DESC, a.time DESC
    `;
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get appointments', error: err.message });
  }
});

// Get all appointments (admin, or filter by doctor)
router.get('/', async (req, res) => {
  const { doctor_id } = req.query;
  try {
    const where = doctor_id ? `WHERE a.doctor_id = ${parseInt(doctor_id)}` : '';
    const appointments = await prisma.$queryRawUnsafe(`
      SELECT a.*, p.fullName as patient_name, d.Doctor as doctor_name
      FROM appointment_booking_app_appointments a
      JOIN appointment_booking_app_patient p ON a.patient_id = p.id
      JOIN doctormaster d ON a.doctor_id = d.DoctorId
      ${where}
      ORDER BY a.date DESC, a.time DESC
    `);
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get appointments', error: err.message });
  }
});

// Doctor accept/cancel appointment
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['accepted', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  
  const dbStatus = status === 'completed' ? 'completed' : status;
  
  try {
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET status = ${dbStatus}
      WHERE id = ${parseInt(id)}
    `;
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// Cancel appointment with reason
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  if (!reason || reason.trim() === '') {
    return res.status(400).json({ success: false, message: 'Cancellation reason is required' });
  }
  try {
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET status = 'cancelled', cancel_reason = ${reason}
      WHERE id = ${parseInt(id)}
    `;
    res.status(200).json({ success: true, message: 'Appointment cancelled with reason' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment', error: err.message });
  }
});

// Reschedule appointment
router.put('/:id/reschedule', async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  if (!date || !time) {
    return res.status(400).json({ success: false, message: 'New date and time are required' });
  }
  try {
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET Reschedule_date = ${date}, Reschedule_time = ${time}, status = 'pending'
      WHERE id = ${parseInt(id)}
    `;
    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reschedule appointment', error: err.message });
  }
});

// Generate video call link for accepted appointments
router.post('/:id/video-call', async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.$queryRaw`
      SELECT *, 
        CASE 
          WHEN Reschedule_date IS NOT NULL AND Reschedule_time IS NOT NULL 
          THEN CONCAT(Reschedule_date, ' ', Reschedule_time)
          ELSE CONCAT(date, ' ', time)
        END as final_datetime
      FROM appointment_booking_app_appointments
      WHERE id = ${parseInt(id)} AND status = 'accepted'
    `;
    
    if (!appointment.length) {
      return res.status(404).json({ success: false, message: 'Accepted appointment not found' });
    }
    
    const appt = appointment[0];
    const roomId = `appointment_${id}_${Date.now()}`;
    const videoCallLink = `https://xrk77z9r-8080.inc1.devtunnels.ms/video-call.html?room=${roomId}&userId=${appt.doctor_id}&userType=doctor`;
    const patientLink = `https://xrk77z9r-8080.inc1.devtunnels.ms/video-call.html?room=${roomId}&userId=${appt.patient_id}&userType=patient`;
    
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET video_call_link = ${videoCallLink}, video_room_id = ${roomId}
      WHERE id = ${parseInt(id)}
    `;
    
    res.status(200).json({ 
      success: true, 
      doctor_link: videoCallLink,
      patient_link: patientLink,
      room_id: roomId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate video call link', error: err.message });
  }
});

// Get appointment details for video call
router.get('/:roomId/details', async (req, res) => {
  const { roomId } = req.params;
  try {
    const appointmentId = roomId.split('_')[1];
    
    const appointment = await prisma.$queryRaw`
      SELECT a.*, p.fullName as patient_name, d.Doctor as doctor_name
      FROM appointment_booking_app_appointments a
      LEFT JOIN appointment_booking_app_patient p ON a.patient_id = p.id
      LEFT JOIN doctormaster d ON a.doctor_id = d.DoctorId
      WHERE a.id = ${parseInt(appointmentId)} AND a.status = 'accepted'
    `;
    
    if (!appointment.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const appt = appointment[0];
    res.status(200).json({ 
      success: true, 
      appointment: {
        id: appt.id,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        patient_name: appt.patient_name || 'Patient',
        doctor_name: appt.doctor_name || 'Doctor',
        date: appt.date,
        time: appt.time,
        room_id: appt.video_room_id
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get appointment details', error: err.message });
  }
});

// Validate video call access
router.post('/validate-call/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { userId, userType } = req.body;
  
  try {
    const appointmentId = roomId.split('_')[1];
    
    const appointment = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_appointments
      WHERE id = ${parseInt(appointmentId)} AND status = 'accepted'
    `;
    
    if (!appointment.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const appt = appointment[0];
    const hasAccess = (userType === 'patient' && appt.patient_id === parseInt(userId)) ||
                     (userType === 'doctor' && appt.doctor_id === parseInt(userId));
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.status(200).json({ success: true, message: 'Access validated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to validate access', error: err.message });
  }
});









// Upload prescription file
router.post('/prescription/upload/:appointmentId', upload.single('prescription_file'), async (req, res) => {
  const { appointmentId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  try {
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET prescription_by_doctor = ${req.file.path}
      WHERE id = ${parseInt(appointmentId)}
    `;
    
    res.status(200).json({ 
      success: true, 
      message: 'Prescription uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to upload prescription', error: err.message });
  }
});

// Get prescription file (only accessible by patient_id or doctor_id)
router.get('/prescription/file/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const { user_id, user_type } = req.query;
  
  if (!user_id || !user_type) {
    return res.status(400).json({ success: false, message: 'user_id and user_type are required' });
  }
  
  try {
    const appointment = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_appointments WHERE id = ${parseInt(appointmentId)}
    `;
    
    if (!appointment.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const appointmentData = appointment[0];
    
    const hasAccess = (user_type === 'patient' && appointmentData.patient_id === parseInt(user_id)) ||
                     (user_type === 'doctor' && appointmentData.doctor_id === parseInt(user_id));
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (!appointmentData.prescription_by_doctor) {
      return res.status(404).json({ success: false, message: 'No prescription file found' });
    }
    
    res.sendFile(path.resolve(appointmentData.prescription_by_doctor));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get prescription file', error: err.message });
  }
});

export default router;