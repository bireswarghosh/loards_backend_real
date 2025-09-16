import prisma from '../prisma/client.js';

// Create prescription delivery table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_prescription_delivery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    prescription_image VARCHAR(255),
    delivery_type ENUM('home_delivery', 'hospital_pickup') DEFAULT 'home_delivery',
    home_delivery_location VARCHAR(255),
    home_delivery_address TEXT,
    status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES appointment_booking_app_patient(id) ON DELETE CASCADE
  )
`.catch(err => console.error('Error creating prescription delivery table:', err));

// Create prescription delivery
export const createPrescriptionDelivery = async (req, res) => {
  try {
    const {
      patient_id,
      name,
      phone_number,
      delivery_type,
      home_delivery_location,
      home_delivery_address
    } = req.body;
    
    const prescription_image = req.file ? req.file.filename : null;

    if (!patient_id || !name || !phone_number || !delivery_type) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, name, phone number, and delivery type are required'
      });
    }

    // Check if patient exists
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

    // Validate home delivery fields
    if (delivery_type === 'home_delivery') {
      if (!home_delivery_location || !home_delivery_address) {
        return res.status(400).json({
          success: false,
          message: 'Home delivery location and address are required for home delivery'
        });
      }
    }

    // Insert delivery into database
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_prescription_delivery (
        patient_id, name, phone_number, prescription_image, delivery_type,
        home_delivery_location, home_delivery_address
      )
      VALUES (
        ${parseInt(patient_id)},
        ${name},
        ${phone_number},
        ${prescription_image},
        ${delivery_type},
        ${home_delivery_location || null},
        ${home_delivery_address || null}
      )
    `;

    // Get the created delivery
    const deliveries = await prisma.$queryRaw`
      SELECT d.*, p.fullName as patient_full_name
      FROM appointment_booking_app_prescription_delivery d
      LEFT JOIN appointment_booking_app_patient p ON d.patient_id = p.id
      ORDER BY d.id DESC LIMIT 1
    `;

    return res.status(201).json({
      success: true,
      message: 'Prescription delivery created successfully',
      delivery: deliveries[0]
    });

  } catch (err) {
    console.error('Create prescription delivery error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create prescription delivery',
      error: err.message
    });
  }
};

// Get all prescription deliveries
export const getAllPrescriptionDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.$queryRaw`
      SELECT 
        d.*,
        p.fullName as patient_full_name
      FROM appointment_booking_app_prescription_delivery d
      LEFT JOIN appointment_booking_app_patient p ON d.patient_id = p.id
      ORDER BY d.createdAt DESC
    `;

    return res.status(200).json({
      success: true,
      deliveries
    });
  } catch (err) {
    console.error('Get prescription deliveries error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get prescription deliveries',
      error: err.message
    });
  }
};

// Get prescription delivery by ID
export const getPrescriptionDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveries = await prisma.$queryRaw`
      SELECT 
        d.*,
        p.fullName as patient_full_name
      FROM appointment_booking_app_prescription_delivery d
      LEFT JOIN appointment_booking_app_patient p ON d.patient_id = p.id
      WHERE d.id = ${parseInt(id)}
    `;

    if (deliveries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescription delivery not found'
      });
    }

    return res.status(200).json({
      success: true,
      delivery: deliveries[0]
    });
  } catch (err) {
    console.error('Get prescription delivery error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get prescription delivery',
      error: err.message
    });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, confirmed, delivered, cancelled)'
      });
    }

    // Check if delivery exists
    const existingDeliveries = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_prescription_delivery
      WHERE id = ${parseInt(id)}
    `;

    if (existingDeliveries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescription delivery not found'
      });
    }

    // Update delivery status
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_prescription_delivery
      SET status = ${status}
      WHERE id = ${parseInt(id)}
    `;

    // Get updated delivery
    const updatedDeliveries = await prisma.$queryRaw`
      SELECT 
        d.*,
        p.fullName as patient_full_name
      FROM appointment_booking_app_prescription_delivery d
      LEFT JOIN appointment_booking_app_patient p ON d.patient_id = p.id
      WHERE d.id = ${parseInt(id)}
    `;

    return res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      delivery: updatedDeliveries[0]
    });
  } catch (err) {
    console.error('Update delivery status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: err.message
    });
  }
};

// Get deliveries by patient ID
export const getDeliveriesByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const deliveries = await prisma.$queryRaw`
      SELECT 
        d.*,
        p.fullName as patient_full_name
      FROM appointment_booking_app_prescription_delivery d
      LEFT JOIN appointment_booking_app_patient p ON d.patient_id = p.id
      WHERE d.patient_id = ${parseInt(patientId)}
      ORDER BY d.createdAt DESC
    `;

    return res.status(200).json({
      success: true,
      deliveries
    });
  } catch (err) {
    console.error('Get deliveries by patient ID error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get deliveries',
      error: err.message
    });
  }
};

// Get patients for dropdown
export const getPatients = async (req, res) => {
  try {
    const patients = await prisma.$queryRaw`
      SELECT id, fullName, phoneNumber
      FROM appointment_booking_app_patient
      ORDER BY fullName ASC
      LIMIT 100
    `;

    return res.status(200).json({
      success: true,
      patients
    });
  } catch (err) {
    console.error('Get patients error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: err.message
    });
  }
};