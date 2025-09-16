import { validationResult } from 'express-validator';
import * as BookingModel from '../../models/OPD/booking.model.js';

// Get all bookings with pagination and filters
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Extract filters from query params
    const filters = {
      patientName: req.query.patientName,
      phone: req.query.phone,
      bookingDate: req.query.bookingDate,
      doctorId: req.query.doctorId
    };
    
    const result = await BookingModel.getAllBookings(page, limit, filters);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await BookingModel.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Required fields validation
    const { patientName, phone, age, sex, doctorId } = req.body;
    
    if (!patientName || !phone || !age || !sex || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientName, phone, age, sex, doctorId'
      });
    }
    
    const bookingData = {
      patientName,
      phone,
      age,
      sex,
      doctorId,
      ...req.body // Include any other fields provided
    };
    
    const result = await BookingModel.createBooking(bookingData);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const updated = await BookingModel.updateBooking(id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or no changes made'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }
    
    const cancelled = await BookingModel.cancelBooking(id, reason);
    
    if (!cancelled) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already cancelled'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await BookingModel.deleteBooking(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
};