import prisma from '../prisma/client.js';

// Create nursing booking table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_nursing_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nursing_package_id INT NOT NULL,
    patient_id INT,
    admition_id VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    existing_patient ENUM('yes', 'no') NOT NULL,
    patient_name VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    address TEXT,
    advance_booking DECIMAL(10,2) DEFAULT 0,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nursing_package_id) REFERENCES appointment_booking_app_nursing_packages(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES appointment_booking_app_patient(id) ON DELETE SET NULL
  )
`.catch(err => console.error('Error creating nursing bookings table:', err));

// Book nursing package
export const bookNursingPackage = async (req, res) => {
  try {
    const {
      nursing_package_id,
      patient_id,
      admition_id,
      start_date,
      end_date,
      existing_patient,
      patient_name,
      phone_number,
      email,
      gender,
      age,
      address,
      advance_booking,
      transaction_id
    } = req.body;

    // Validate required fields
    if (!nursing_package_id || !start_date || !end_date || !existing_patient) {
      return res.status(400).json({
        success: false,
        message: 'Nursing package ID, start date, end date, and existing patient status are required'
      });
    }

    // Check if nursing package exists
    const packages = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_packages
      WHERE id = ${parseInt(nursing_package_id)}
    `;

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing package not found'
      });
    }

    // Validate existing patient logic
    if (existing_patient === 'yes') {
      if (!admition_id) {
        return res.status(400).json({
          success: false,
          message: 'Admission ID is required for existing patients'
        });
      }

      // Check if admission exists
      const admissions = await prisma.$queryRaw`
        SELECT * FROM admition
        WHERE AdmitionId = ${admition_id}
      `;

      if (admissions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admission record not found'
        });
      }

    } else if (existing_patient === 'no') {
      // Validate new patient fields
      if (!patient_name || !phone_number || !email || !gender || !age || !address) {
        return res.status(400).json({
          success: false,
          message: 'Patient name, phone, email, gender, age, and address are required for new patients'
        });
      }
    }

    // Check if patient exists (if patient_id provided)
    if (patient_id) {
      const patients = await prisma.$queryRaw`
        SELECT * FROM appointment_booking_app_patient
        WHERE id = ${parseInt(patient_id)}
      `;

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }
    }

    // Insert booking into database
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_nursing_bookings (
        nursing_package_id, patient_id, admition_id, start_date, end_date,
        existing_patient, patient_name, phone_number, email, gender, age, address, advance_booking, transaction_id
      )
      VALUES (
        ${parseInt(nursing_package_id)},
        ${patient_id ? parseInt(patient_id) : null},
        ${admition_id || null},
        ${start_date},
        ${end_date},
        ${existing_patient},
        ${patient_name || null},
        ${phone_number || null},
        ${email || null},
        ${gender || null},
        ${age ? parseInt(age) : null},
        ${address || null},
        ${advance_booking ? parseFloat(advance_booking) : 0},
        ${transaction_id || null}
      )
    `;

    // Get the created booking

    const bookings = await prisma.$queryRaw`
      SELECT b.*, p.package_name, c.name as category_name
      FROM appointment_booking_app_nursing_bookings b
      JOIN appointment_booking_app_nursing_packages p ON b.nursing_package_id = p.id
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      ORDER BY b.id DESC LIMIT 1
    `;

    return res.status(201).json({
      success: true,
      message: 'Nursing package booked successfully',
      booking: bookings[0]
    });

  } catch (err) {
    console.error('Book nursing package error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to book nursing package',
      error: err.message

    });
  }

};

// Get all nursing bookings
export const getAllNursingBookings = async (req, res) => {
  try {
    const bookings = await prisma.$queryRaw`
      SELECT 
        b.*,
        p.package_name,
        p.duration,
        p.price,
        c.name as category_name,
        pt.fullName as patient_full_name
      FROM appointment_booking_app_nursing_bookings b
      JOIN appointment_booking_app_nursing_packages p ON b.nursing_package_id = p.id
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      LEFT JOIN appointment_booking_app_patient pt ON b.patient_id = pt.id
      ORDER BY b.createdAt DESC
    `;

    return res.status(200).json({
      success: true,
      bookings
    });
  } catch (err) {
    console.error('Get nursing bookings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get nursing bookings',
      error: err.message
    });
  }
};


// Get nursing booking by ID
export const getNursingBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await prisma.$queryRaw`
      SELECT 
        b.*,
        p.package_name,
        p.duration,
        p.price,
        p.description,
        c.name as category_name,
        pt.fullName as patient_full_name
      FROM appointment_booking_app_nursing_bookings b
      JOIN appointment_booking_app_nursing_packages p ON b.nursing_package_id = p.id
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      LEFT JOIN appointment_booking_app_patient pt ON b.patient_id = pt.id
      WHERE b.id = ${parseInt(id)}
    `;

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      booking: bookings[0]
    });
  } catch (err) {
    console.error('Get nursing booking error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get nursing booking',
      error: err.message
    });
  }
};


// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, confirmed, completed, cancelled)'
      });
    }

    // Check if booking exists
    const existingBookings = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_bookings
      WHERE id = ${parseInt(id)}
    `;

    if (existingBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing booking not found'
      });
    }

    // Update booking status
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_nursing_bookings
      SET status = ${status}
      WHERE id = ${parseInt(id)}
    `;

    // Get updated booking
    const updatedBookings = await prisma.$queryRaw`
      SELECT 
        b.*,
        p.package_name,
        c.name as category_name
      FROM appointment_booking_app_nursing_bookings b
      JOIN appointment_booking_app_nursing_packages p ON b.nursing_package_id = p.id
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      WHERE b.id = ${parseInt(id)}
    `;

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBookings[0]
    });
  } catch (err) {
    console.error('Update booking status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: err.message
    });
  }
};

// Get bookings by patient ID
export const getBookingsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const bookings = await prisma.$queryRaw`
      SELECT 
        b.*,
        p.package_name,
        p.duration,
        p.price,
        c.name as category_name
      FROM appointment_booking_app_nursing_bookings b
      JOIN appointment_booking_app_nursing_packages p ON b.nursing_package_id = p.id
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      WHERE b.patient_id = ${parseInt(patientId)}
      ORDER BY b.createdAt DESC
    `;

    return res.status(200).json({
      success: true,
      bookings
    });
  } catch (err) {
    console.error('Get bookings by patient ID error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: err.message
    });
  }
};

// Get admissions for dropdown (helper endpoint)
export const getAdmissions = async (req, res) => {
  try {
    const admissions = await prisma.$queryRaw`
      SELECT AdmitionId, PatientName, PhoneNo, AdmitionDate
      FROM admition
      ORDER BY AdmitionDate DESC
      LIMIT 100
    `;

    return res.status(200).json({
      success: true,
      admissions
    });
  } catch (err) {
    console.error('Get admissions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get admissions',
      error: err.message
    });
  }
};