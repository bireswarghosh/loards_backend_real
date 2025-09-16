import prisma from '../prisma/client.js';

// CREATE - Add new AC Head
export const createAcHead = async (req, res) => {
  try {
    const { ACHead, System } = req.body;

    const acHead = await prisma.acHead.create({
      data: {
        ACHead,
        System
      }
    });

    res.status(201).json({
      success: true,
      message: 'AC Head created successfully',
      data: acHead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating AC Head',
      error: error.message
    });
  }
};

// READ - Get all AC Heads with pagination and search
export const getAllAcHeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search ? {
      ACHead: {
        contains: search,
        mode: 'insensitive'
      }
    } : {};

    const [acHeads, total] = await Promise.all([
      prisma.acHead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ACHeadId: 'desc' }
      }),
      prisma.acHead.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'AC Heads list',
      data: acHeads,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Heads list',
      error: error.message
    });
  }
};

// READ - Get AC Head by ID
export const getAcHeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const acHead = await prisma.acHead.findUnique({
      where: { ACHeadId: parseInt(id) }
    });

    if (!acHead) {
      return res.status(404).json({
        success: false,
        message: 'AC Head not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'AC Head details',
      data: acHead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Head details',
      error: error.message
    });
  }
};

// UPDATE - Update AC Head
export const updateAcHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { ACHead, System } = req.body;

    const acHead = await prisma.acHead.update({
      where: { ACHeadId: parseInt(id) },
      data: {
        ACHead,
        System
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'AC Head updated successfully',
      data: acHead
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Head not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating AC Head',
      error: error.message
    });
  }
};

// DELETE - Delete AC Head
export const deleteAcHead = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.acHead.delete({
      where: { ACHeadId: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'AC Head deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Head not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting AC Head',
      error: error.message
    });
  }
};