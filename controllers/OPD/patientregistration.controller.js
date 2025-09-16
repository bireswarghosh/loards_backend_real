// backend/controllers/OPD/patientregistration.controller.js
import prisma from '../../prisma/client.js';

// GET ALL - Get all patient registrations with pagination
export const getAllPatientRegistrationsController = async (req, res) => {
  try {
    // Extract page and limit from query parameters, set defaults
    const { page = 1, limit = 50 } = req.query;
    
    // Calculate how many records to skip for pagination
    const skip = (page - 1) * limit;
    
    // Run both queries in parallel for better performance
    const [data, total] = await Promise.all([
      // Get paginated data ordered by latest first
      prisma.patientregistration.findMany({
        skip: skip,                              // Skip records for pagination
        take: parseInt(limit),                   // Limit number of records
        orderBy: { RegistrationDate: 'desc' }    // Order by newest first
      }),
      // Get total count for pagination info
      prisma.patientregistration.count()
    ]);
    
    // Send response with data and pagination info
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching patient registrations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// CREATE - Create new patient registration
export const createPatientRegistrationController = async (req, res) => {
  try {
    // Create new record using Prisma
    const result = await prisma.patientregistration.create({
      data: req.body  // Use request body as data
    });
    
    res.status(201).json({
      success: true,
      message: 'Patient registration created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating patient registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// GET BY ID - Get single patient registration by ID
export const getPatientRegistrationByIdController = async (req, res) => {
  try {
    const { id } = req.params;  // Extract ID from URL parameters
    
    // Find unique record by RegistrationId
    const registration = await prisma.patientregistration.findUnique({
      where: { RegistrationId: id }
    });
    
    // Check if record exists
    if (!registration) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient registration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching patient registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UPDATE - Update patient registration
export const updatePatientRegistrationController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove RegistrationId from update data to prevent changing primary key
    const { RegistrationId, ...updateData } = req.body;
    
    // Convert string numbers to proper types
    if (updateData.Age) updateData.Age = parseFloat(updateData.Age);
    if (updateData.ReligionId) updateData.ReligionId = parseInt(updateData.ReligionId);
    if (updateData.Weight) updateData.Weight = parseFloat(updateData.Weight);
    if (updateData.Height) updateData.Height = parseFloat(updateData.Height);
    
    // Update record using Prisma
    const result = await prisma.patientregistration.update({
      where: { RegistrationId: id },
      data: updateData
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Patient registration updated successfully',
      data: result
    });
  } catch (error) {
    // Handle case where record doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Patient registration not found'
      });
    }
    
    console.error('Error updating patient registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// DELETE - Delete patient registration
export const deletePatientRegistrationController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use transaction to safely delete patient and related bills
    await prisma.$transaction(async (tx) => {
      // First delete all related outdoor bills
      await tx.outdoorbillmst.deleteMany({
        where: { RegistrationId: id }
      });
      
      // Then delete the patient registration
      await tx.patientregistration.delete({
        where: { RegistrationId: id }
      });
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Patient registration and related records deleted successfully'
    });
  } catch (error) {
    // Handle case where record doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Patient registration not found'
      });
    }
    
    console.error('Error deleting patient registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// SEARCH BY PHONE - Search patient registrations by phone number
export const searchPatientRegistrationsByPhoneController = async (req, res) => {
  try {
    const { phone } = req.query;  // Extract phone from query parameters
    
    // Validate phone parameter
    if (!phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Search records by phone number
    const registrations = await prisma.patientregistration.findMany({
      where: { PhoneNo: phone },
      orderBy: { RegistrationDate: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Error searching patient registrations by phone:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};