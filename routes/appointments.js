import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

// Create appointment (patient)
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, appointment_type, date, time, problem } = req.body;
  if (!patient_id || !doctor_id || !appointment_type || !date || !time) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  try {
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_appointments
      (patient_id, doctor_id, appointment_type, date, time, problem)
      VALUES (${patient_id}, ${doctor_id}, ${appointment_type}, ${date}, ${time}, ${problem || null})
    `;
    res.status(201).json({ success: true, message: 'Appointment created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error: err.message });
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
  if (!['accepted', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_appointments
      SET status = ${status}
      WHERE id = ${parseInt(id)}
    `;
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

export default router;