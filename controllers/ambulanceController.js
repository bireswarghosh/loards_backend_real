import prisma from '../prisma/client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create ambulance table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_ambulance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`.catch(err => console.error('Error creating ambulance table:', err));

// Create ambulance pickup requests table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_ambulance_pickup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ambulance_id INT NOT NULL,
    patient_id INT,
    pickup_area VARCHAR(100) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    destination_area VARCHAR(100) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ambulance_id) REFERENCES appointment_booking_app_ambulance(id) ON DELETE CASCADE
  )
`.catch(err => console.error('Error creating ambulance pickup requests table:', err));

// Add patient_id column if it doesn't exist
prisma.$executeRaw`
  ALTER TABLE appointment_booking_app_ambulance_pickup
  ADD COLUMN IF NOT EXISTS patient_id INT
`.catch(err => console.error('Error adding patient_id column:', err));

// Skip adding foreign key constraint as it already exists or causes conflicts
// We'll just use the patient_id column without an explicit constraint

// Add ambulance
export const addAmbulance = async (req, res) => {
  try {
    const { name } = req.body;
    let logoPath = null;
    
    // Check if name is provided
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Ambulance name is required'
      });
    }
    
    // Handle logo upload
    if (req.file) {
      logoPath = `/uploads/ambulance/${req.file.filename}`;
    }
    
    // Insert ambulance into database
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_ambulance (name, logo)
      VALUES (${name}, ${logoPath})
    `;
    
    // Get the created ambulance
    const ambulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE name = ${name}
      ORDER BY id DESC LIMIT 1
    `;
    
    return res.status(201).json({
      success: true,
      message: 'Ambulance added successfully',
      ambulance: ambulances[0]
    });
  } catch (err) {
    console.error('Add ambulance error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add ambulance',
      error: err.message
    });
  }
};

// Get all ambulances
export const getAllAmbulances = async (req, res) => {
  try {
    const ambulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      ORDER BY id DESC
    `;
    
    return res.status(200).json({
      success: true,
      ambulances
    });
  } catch (err) {
    console.error('Get ambulances error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get ambulances',
      error: err.message
    });
  }
};

// Get ambulance by ID
export const getAmbulanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ambulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(id)}
    `;
    
    if (ambulances.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      ambulance: ambulances[0]
    });
  } catch (err) {
    console.error('Get ambulance error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get ambulance',
      error: err.message
    });
  }
};

// Update ambulance
export const updateAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Check if ambulance exists
    const existingAmbulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingAmbulances.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }
    
    const existingAmbulance = existingAmbulances[0];
    let logoPath = existingAmbulance.logo;
    
    // Handle logo upload
    if (req.file) {
      // Delete old logo if exists
      if (existingAmbulance.logo) {
        const oldLogoPath = path.join(__dirname, '..', existingAmbulance.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      logoPath = `/uploads/ambulance/${req.file.filename}`;
    }
    
    // Update ambulance
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_ambulance
      SET name = ${name || existingAmbulance.name},
          logo = ${logoPath}
      WHERE id = ${parseInt(id)}
    `;
    
    // Get updated ambulance
    const updatedAmbulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Ambulance updated successfully',
      ambulance: updatedAmbulances[0]
    });
  } catch (err) {
    console.error('Update ambulance error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ambulance',
      error: err.message
    });
  }
};

// Delete ambulance
export const deleteAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ambulance exists
    const existingAmbulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingAmbulances.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }
    
    const existingAmbulance = existingAmbulances[0];
    
    // Delete logo if exists
    if (existingAmbulance.logo) {
      const logoPath = path.join(__dirname, '..', existingAmbulance.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    // Delete ambulance
    await prisma.$executeRaw`
      DELETE FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Ambulance deleted successfully'
    });
  } catch (err) {
    console.error('Delete ambulance error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ambulance',
      error: err.message
    });
  }
};

// Create ambulance pickup request
export const createPickupRequest = async (req, res) => {
  try {
    const { 
      ambulance_id, 
      patient_id,
      pickup_area, 
      pickup_address, 
      destination_area, 
      destination_address, 
      name, 
      phone_number 
    } = req.body;
    
    // Validate required fields
    if (!ambulance_id || !pickup_area || !pickup_address || !destination_area || 
        !destination_address || !name || !phone_number) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if ambulance exists
    const ambulances = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance
      WHERE id = ${parseInt(ambulance_id)}
    `;
    
    if (ambulances.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }
    
    // Check if patient exists if patient_id is provided
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
    
    // Create pickup request
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_ambulance_pickup (
        ambulance_id, patient_id, pickup_area, pickup_address, destination_area, 
        destination_address, name, phone_number
      ) VALUES (
        ${parseInt(ambulance_id)}, 
        ${patient_id ? parseInt(patient_id) : null}, 
        ${pickup_area}, ${pickup_address}, 
        ${destination_area}, ${destination_address}, ${name}, ${phone_number}
      )
    `;
    
    // Get the created pickup request
    const pickupRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance_pickup
      WHERE ambulance_id = ${parseInt(ambulance_id)}
      ORDER BY id DESC LIMIT 1
    `;
    
    return res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      pickupRequest: pickupRequests[0]
    });
  } catch (err) {
    console.error('Create pickup request error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create pickup request',
      error: err.message
    });
  }
};

// Get all pickup requests
export const getAllPickupRequests = async (req, res) => {
  try {
    const pickupRequests = await prisma.$queryRaw`
      SELECT p.*, a.name as ambulance_name 
      FROM appointment_booking_app_ambulance_pickup p
      JOIN appointment_booking_app_ambulance a ON p.ambulance_id = a.id
      ORDER BY p.id DESC
    `;
    
    return res.status(200).json({
      success: true,
      pickupRequests
    });
  } catch (err) {
    console.error('Get pickup requests error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get pickup requests',
      error: err.message
    });
  }
};

// Get pickup requests by ambulance ID
export const getPickupRequestsByAmbulanceId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pickupRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance_pickup
      WHERE ambulance_id = ${parseInt(id)}
      ORDER BY id DESC
    `;
    
    return res.status(200).json({
      success: true,
      pickupRequests
    });
  } catch (err) {
    console.error('Get pickup requests by ambulance ID error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get pickup requests',
      error: err.message
    });
  }
};

// Update pickup request status
export const updatePickupRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }
    
    // Check if pickup request exists
    const existingRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance_pickup
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }
    
    // Update pickup request status
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_ambulance_pickup
      SET status = ${status}
      WHERE id = ${parseInt(id)}
    `;
    
    // Get updated pickup request
    const updatedRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance_pickup
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Pickup request status updated successfully',
      pickupRequest: updatedRequests[0]
    });
  } catch (err) {
    console.error('Update pickup request status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update pickup request status',
      error: err.message
    });
  }
};

// Delete pickup request
export const deletePickupRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if pickup request exists
    const existingRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_ambulance_pickup
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }
    
    // Delete pickup request
    await prisma.$executeRaw`
      DELETE FROM appointment_booking_app_ambulance_pickup
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Pickup request deleted successfully'
    });
  } catch (err) {
    console.error('Delete pickup request error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete pickup request',
      error: err.message
    });
  }
};

// Get pickup requests by patient ID
export const getPickupRequestsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patients = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_patient
      WHERE id = ${parseInt(patientId)}
    `;
    
    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Get pickup requests with ambulance details
    const pickupRequests = await prisma.$queryRaw`
      SELECT p.*, a.name as ambulance_name 
      FROM appointment_booking_app_ambulance_pickup p
      JOIN appointment_booking_app_ambulance a ON p.ambulance_id = a.id
      WHERE p.patient_id = ${parseInt(patientId)}
      ORDER BY p.id DESC
    `;
    
    return res.status(200).json({
      success: true,
      pickupRequests
    });
  } catch (err) {
    console.error('Get pickup requests by patient ID error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get pickup requests',
      error: err.message
    });
  }
};