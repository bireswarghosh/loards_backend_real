// backend/controllers/OPD/outdoorbillmst.controller.js
import prisma from '../../prisma/client.js';

// GET ALL - Get all outdoor bills with pagination
export const getAllOutdoorBillsController = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    // Get paginated data and total count in parallel
    const [data, total] = await Promise.all([
      prisma.outdoorbillmst.findMany({
        skip: skip,
        take: parseInt(limit),
        orderBy: { OutBillDate: 'desc' }
      }),
      prisma.outdoorbillmst.count()
    ]);
    
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
    console.error('Error fetching outdoor bills:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// CREATE - Create new outdoor bill
export const createOutdoorBillController = async (req, res) => {
  try {
    const result = await prisma.outdoorbillmst.create({
      data: req.body
    });
    
    res.status(201).json({
      success: true,
      message: 'Outdoor bill created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating outdoor bill:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// GET BY ID - Get single outdoor bill by ID
export const getOutdoorBillByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bill = await prisma.outdoorbillmst.findUnique({
      where: { OutBillId: id }
    });
    
    if (!bill) {
      return res.status(404).json({ 
        success: false,
        message: 'Outdoor bill not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching outdoor bill:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UPDATE - Update outdoor bill
export const updateOutdoorBillController = async (req, res) => {
  try {
    const { id } = req.params;
    const { OutBillId, ...updateData } = req.body;
    
    const result = await prisma.outdoorbillmst.update({
      where: { OutBillId: id },
      data: updateData
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Outdoor bill updated successfully',
      data: result
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Outdoor bill not found'
      });
    }
    
    console.error('Error updating outdoor bill:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// DELETE - Delete outdoor bill
export const deleteOutdoorBillController = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.outdoorbillmst.delete({
      where: { OutBillId: id }
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Outdoor bill deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Outdoor bill not found'
      });
    }
    
    console.error('Error deleting outdoor bill:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// SEARCH BY REGISTRATION ID - Search bills by registration ID
export const searchOutdoorBillsByRegistrationController = async (req, res) => {
  try {
    const { registrationId } = req.query;
    
    if (!registrationId) {
      return res.status(400).json({ 
        success: false,
        message: 'Registration ID is required'
      });
    }
    
    const bills = await prisma.outdoorbillmst.findMany({
      where: { RegistrationId: registrationId },
      orderBy: { OutBillDate: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    console.error('Error searching outdoor bills:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// SEARCH BY DATE RANGE - Search bills by date range
export const searchOutdoorBillsByDateController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const bills = await prisma.outdoorbillmst.findMany({
      where: {
        OutBillDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: { OutBillDate: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    console.error('Error searching outdoor bills by date:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};