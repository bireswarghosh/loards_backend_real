import DiagnosticBookingModel from '../models/diagnosticBooking.model.js';

class DiagnosticBookingController {
  // Create diagnostic booking
  static async createBooking(req, res) {
    try {
      const { name, email, phone, testId, patientId, appointmentDate, appointmentTime } = req.body;
      const diagnostic_prescription = req.file ? req.file.filename : null;
      
      if (!name || !email || !phone || !testId || !patientId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({
          success: false,
          message: 'All fields including appointment date and time are required'
        });
      }

      const bookingId = await DiagnosticBookingModel.createBooking({
        name, email, phone, testId, patientId, appointmentDate, appointmentTime, diagnostic_prescription
      });

      res.status(201).json({
        success: true,
        message: 'Diagnostic booking created successfully',
        bookingId,
        prescription_file: diagnostic_prescription
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all bookings
  static async getAllBookings(req, res) {
    try {
      const bookings = await DiagnosticBookingModel.getAllBookings();
      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get booking by ID
  static async getBookingById(req, res) {
    try {
      const booking = await DiagnosticBookingModel.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get bookings by patient
  static async getBookingsByPatient(req, res) {
    try {
      const bookings = await DiagnosticBookingModel.getBookingsByPatient(req.params.patientId);
      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update booking status
  static async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const result = await DiagnosticBookingModel.updateBookingStatus(req.params.id, status);
      
      res.json({
        success: true,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default DiagnosticBookingController;