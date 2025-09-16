import prisma from '../prisma/client.js';

class DiagnosticBookingModel {
  // Create diagnostic booking
  static async createBooking(bookingData) {
    const { name, email, phone, testId, patientId, appointmentDate, appointmentTime, diagnostic_prescription } = bookingData;
    
    const booking = await prisma.$executeRaw`
      INSERT INTO diagnostic_bookings (name, email, phone, test_id, patient_id, appointment_date, appointment_time, diagnostic_prescription, booking_date, status) 
      VALUES (${name}, ${email}, ${phone}, ${testId}, ${patientId}, ${appointmentDate}, ${appointmentTime}, ${diagnostic_prescription}, NOW(), 'pending')
    `;
    return booking;
  }

  // Get all bookings
  static async getAllBookings() {
    const bookings = await prisma.$queryRaw`
      SELECT db.*, t.Test as test_name, t.Rate as test_rate
      FROM diagnostic_bookings db
      LEFT JOIN test t ON db.test_id = t.TestId
      ORDER BY db.appointment_date DESC, db.appointment_time DESC
    `;
    return bookings;
  }

  // Get booking by ID
  static async getBookingById(id) {
    const booking = await prisma.$queryRaw`
      SELECT db.*, t.Test as test_name, t.Rate as test_rate
      FROM diagnostic_bookings db
      LEFT JOIN test t ON db.test_id = t.TestId
      WHERE db.id = ${id}
    `;
    return booking[0];
  }

  // Get bookings by patient ID
  static async getBookingsByPatient(patientId) {
    const bookings = await prisma.$queryRaw`
      SELECT db.*, t.Test as test_name, t.Rate as test_rate
      FROM diagnostic_bookings db
      LEFT JOIN test t ON db.test_id = t.TestId
      WHERE db.patient_id = ${patientId}
      ORDER BY db.appointment_date DESC, db.appointment_time DESC
    `;
    return bookings;
  }

  // Update booking status
  static async updateBookingStatus(id, status) {
    const result = await prisma.$executeRaw`
      UPDATE diagnostic_bookings SET status = ${status} WHERE id = ${id}
    `;
    return result;
  }
}

export default DiagnosticBookingModel;