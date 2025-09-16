import db from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Get all bookings with pagination and filters
export const getAllBookings = async (page = 1, limit = 10, filters = {}) => {
  try {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM booking01 WHERE 1=1';
    const params = [];
    
    // Apply filters if provided
    if (filters.patientName) {
      query += ' AND PatientName LIKE ?';
      params.push(`%${filters.patientName}%`);
    }
    
    if (filters.phone) {
      query += ' AND Phone LIKE ?';
      params.push(`%${filters.phone}%`);
    }
    
    if (filters.bookingDate) {
      query += ' AND DATE(BookingDate) = ?';
      params.push(filters.bookingDate);
    }
    
    if (filters.doctorId) {
      query += ' AND DoctorId = ?';
      params.push(filters.doctorId);
    }
    
    // Add pagination
    query += ' ORDER BY BookingDate DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM booking01 WHERE 1=1';
    const countParams = [];
    
    if (filters.patientName) {
      countQuery += ' AND PatientName LIKE ?';
      countParams.push(`%${filters.patientName}%`);
    }
    
    if (filters.phone) {
      countQuery += ' AND Phone LIKE ?';
      countParams.push(`%${filters.phone}%`);
    }
    
    if (filters.bookingDate) {
      countQuery += ' AND DATE(BookingDate) = ?';
      countParams.push(filters.bookingDate);
    }
    
    if (filters.doctorId) {
      countQuery += ' AND DoctorId = ?';
      countParams.push(filters.doctorId);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    
    return {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const [rows] = await db.query('SELECT * FROM booking01 WHERE BookingId = ?', [bookingId]);
    return rows[0];
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
};

// Create new booking
export const createBooking = async (bookingData) => {
  try {
    // Generate a unique booking ID
    const bookingId = generateBookingId();
    
    // Set default values for required fields
    const data = {
      BookingId: bookingId,
      BookingTime: bookingData.bookingTime || new Date().toLocaleTimeString(),
      BookingDate: bookingData.bookingDate || new Date(),
      BookingFor: bookingData.bookingFor || new Date(),
      PatientName: bookingData.patientName,
      Phone: bookingData.phone,
      Age: bookingData.age,
      AgeType: bookingData.ageType || 'Y',
      Sex: bookingData.sex,
      DoctorId: bookingData.doctorId,
      Add1: bookingData.add1 || null,
      Add2: bookingData.add2 || null,
      Add3: bookingData.add3 || null,
      CompanyId: bookingData.companyId || null,
      UserId: bookingData.userId || null,
      Total: bookingData.total || 0,
      Receipt: bookingData.receipt || 0,
      BTime: bookingData.bTime || null,
      Remarks: bookingData.remarks || null,
      CancelBookig: 0,
      BookingP: bookingData.bookingP || null,
      BookingNo: bookingData.bookingNo || null,
      BookingS: bookingData.bookingS || null
    };
    
    // Build query dynamically
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await db.query(
      `INSERT INTO booking01 (${fields}) VALUES (${placeholders})`,
      values
    );
    
    return { bookingId, ...data };
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

// Update booking
export const updateBooking = async (bookingId, bookingData) => {
  try {
    // Check if booking exists
    const [checkResult] = await db.query('SELECT 1 FROM booking01 WHERE BookingId = ?', [bookingId]);
    if (checkResult.length === 0) {
      throw new Error('Booking not found');
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    Object.entries(bookingData).forEach(([key, value]) => {
      // Convert camelCase to database column names
      let dbField = key;
      if (key === 'patientName') dbField = 'PatientName';
      if (key === 'bookingDate') dbField = 'BookingDate';
      if (key === 'bookingTime') dbField = 'BookingTime';
      if (key === 'bookingFor') dbField = 'BookingFor';
      if (key === 'doctorId') dbField = 'DoctorId';
      if (key === 'companyId') dbField = 'CompanyId';
      if (key === 'userId') dbField = 'UserId';
      if (key === 'bookingP') dbField = 'BookingP';
      if (key === 'bookingNo') dbField = 'BookingNo';
      if (key === 'bookingS') dbField = 'BookingS';
      if (key === 'add1') dbField = 'Add1';
      if (key === 'add2') dbField = 'Add2';
      if (key === 'add3') dbField = 'Add3';
      if (key === 'bTime') dbField = 'BTime';
      
      updates.push(`${dbField} = ?`);
      values.push(value);
    });
    
    if (updates.length === 0) {
      throw new Error('No fields to update');
    }
    
    // Add bookingId to values array for WHERE clause
    values.push(bookingId);
    
    const [result] = await db.query(
      `UPDATE booking01 SET ${updates.join(', ')} WHERE BookingId = ?`,
      values
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in updateBooking:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId, reason) => {
  try {
    const [result] = await db.query(
      'UPDATE booking01 SET CancelBookig = 1, CancelDate = ?, CancelR = ? WHERE BookingId = ?',
      [new Date(), reason, bookingId]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    throw error;
  }
};

// Delete booking (soft delete by setting CancelBookig = 1)
export const deleteBooking = async (bookingId) => {
  try {
    const [result] = await db.query(
      'UPDATE booking01 SET CancelBookig = 1, CancelDate = ? WHERE BookingId = ?',
      [new Date(), bookingId]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    throw error;
  }
};

// Helper function to generate unique booking ID
function generateBookingId() {
  // Format: BK-YYYYMMDD-XXXX (where XXXX is a random string)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = uuidv4().substring(0, 4).toUpperCase();
  
  return `BK-${year}${month}${day}-${randomPart}`;
}