import prisma from '../prisma/client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create nursing category table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_nursing_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`.catch(err => console.error('Error creating nursing category table:', err));

// Create nursing packages table if not exists
prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS appointment_booking_app_nursing_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nursing_category_id INT NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    advance_booking_price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    service_type JSON,
    overview_points JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nursing_category_id) REFERENCES appointment_booking_app_nursing_category(id) ON DELETE CASCADE
  )
`.catch(err => console.error('Error creating nursing packages table:', err));

// Add new columns if they don't exist
prisma.$executeRaw`
  ALTER TABLE appointment_booking_app_nursing_packages
  ADD COLUMN IF NOT EXISTS service_type JSON,
  ADD COLUMN IF NOT EXISTS overview_points JSON,
  ADD COLUMN IF NOT EXISTS advance_booking_price DECIMAL(10,2) DEFAULT 0
`.catch(err => console.error('Error adding new columns:', err));

// Add nursing category
export const addNursingCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let logoPath = null;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nursing category name is required'
      });
    }
    
    if (req.file) {
      logoPath = `/uploads/nursing/${req.file.filename}`;
    }
    
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_nursing_category (name, logo)
      VALUES (${name}, ${logoPath})
    `;
    
    const categories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE name = ${name}
      ORDER BY id DESC LIMIT 1
    `;
    
    return res.status(201).json({
      success: true,
      message: 'Nursing category added successfully',
      category: categories[0]
    });
  } catch (err) {
    console.error('Add nursing category error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add nursing category',
      error: err.message
    });
  }
};

// Get all nursing categories
export const getAllNursingCategories = async (req, res) => {
  try {
    const categories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      ORDER BY id DESC
    `;
    
    return res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    console.error('Get nursing categories error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get nursing categories',
      error: err.message
    });
  }
};

// Get nursing category by ID
export const getNursingCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const categories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(id)}
    `;
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing category not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      category: categories[0]
    });
  } catch (err) {
    console.error('Get nursing category error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get nursing category',
      error: err.message
    });
  }
};

// Update nursing category
export const updateNursingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const existingCategories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing category not found'
      });
    }
    
    const existingCategory = existingCategories[0];
    let logoPath = existingCategory.logo;
    
    if (req.file) {
      if (existingCategory.logo) {
        const oldLogoPath = path.join(__dirname, '..', existingCategory.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logoPath = `/uploads/nursing/${req.file.filename}`;
    }
    
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_nursing_category
      SET name = ${name || existingCategory.name},
          logo = ${logoPath}
      WHERE id = ${parseInt(id)}
    `;
    
    const updatedCategories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Nursing category updated successfully',
      category: updatedCategories[0]
    });
  } catch (err) {
    console.error('Update nursing category error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update nursing category',
      error: err.message
    });
  }
};

// Delete nursing category
export const deleteNursingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingCategories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(id)}
    `;
    
    if (existingCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing category not found'
      });
    }
    
    const existingCategory = existingCategories[0];
    
    if (existingCategory.logo) {
      const logoPath = path.join(__dirname, '..', existingCategory.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await prisma.$executeRaw`
      DELETE FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(id)}
    `;
    
    return res.status(200).json({
      success: true,
      message: 'Nursing category deleted successfully'
    });
  } catch (err) {
    console.error('Delete nursing category error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete nursing category',
      error: err.message
    });
  }
};




// Add nursing package
export const addNursingPackage = async (req, res) => {
  try {
    const { nursing_category_id, package_name, duration, price, advance_booking_price, description, service_type, overview_points } = req.body;
    
    if (!nursing_category_id || !package_name || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Nursing category ID, package name, and duration are required'
      });
    }
    
    // Check if nursing category exists
    const categories = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_category
      WHERE id = ${parseInt(nursing_category_id)}
    `;
    
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nursing category not found'
      });
    }
    
    // Convert arrays to JSON strings
    const overviewPointsJson = overview_points ? JSON.stringify(overview_points) : null;
    const serviceTypeJson = service_type ? JSON.stringify(service_type) : null;
    
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_nursing_packages (
        nursing_category_id, package_name, duration, price, advance_booking_price, description, service_type, overview_points
      )
      VALUES (
        ${parseInt(nursing_category_id)}, ${package_name}, ${duration}, 
        ${price ? parseFloat(price) : null}, ${advance_booking_price ? parseFloat(advance_booking_price) : 0},
        ${description || null}, ${serviceTypeJson}, ${overviewPointsJson}
      )
    `;
    
    const packages = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_nursing_packages
      WHERE nursing_category_id = ${parseInt(nursing_category_id)}
      ORDER BY id DESC LIMIT 1
    `;
    
    return res.status(201).json({
      success: true,
      message: 'Nursing package added successfully',
      package: packages[0]
    });
  } catch (err) {
    console.error('Add nursing package error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add nursing package',
      error: err.message
    });
  }
};






// Get nursing packages by category ID
export const getNursingPackagesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const packages = await prisma.$queryRaw`
      SELECT p.*, c.name as category_name
      FROM appointment_booking_app_nursing_packages p
      JOIN appointment_booking_app_nursing_category c ON p.nursing_category_id = c.id
      WHERE p.nursing_category_id = ${parseInt(categoryId)}
      ORDER BY p.id DESC
    `;
    
    return res.status(200).json({
      success: true,
      packages
    });
  } catch (err) {
    console.error('Get nursing packages error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to get nursing packages',
      error: err.message
    });
  }
};