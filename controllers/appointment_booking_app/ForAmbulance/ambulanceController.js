import prisma from '../../../prisma/client.js';
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
        const oldLogoPath = path.join(__dirname, '../../../..', existingAmbulance.logo);
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
      const logoPath = path.join(__dirname, '../../../..', existingAmbulance.logo);
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