import prisma from '../prisma/client.js';

// CREATE - Add new AC Group
export const createAcGroup = async (req, res) => {
  try {
    const { ACGroup, ACHeadId, System } = req.body;

    const acGroup = await prisma.acGroup.create({
      data: {
        ACGroup,
        ACHeadId: parseInt(ACHeadId),
        System
      },
      include: {
        acHead: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'AC Group created successfully',
      data: acGroup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating AC Group',
      error: error.message
    });
  }
};

// READ - Get all AC Groups with AC Head details
export const getAllAcGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search ? {
      OR: [
        { ACGroup: { contains: search, mode: 'insensitive' } },
        { acHead: { ACHead: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    const [acGroups, total] = await Promise.all([
      prisma.acGroup.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ACGroupId: 'desc' },
        include: {
          acHead: true
        }
      }),
      prisma.acGroup.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'AC Groups list',
      data: acGroups,
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
      message: 'Error fetching AC Groups list',
      error: error.message
    });
  }
};

// READ - Get AC Group by ID
export const getAcGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const acGroup = await prisma.acGroup.findUnique({
      where: { ACGroupId: parseInt(id) },
      include: {
        acHead: true
      }
    });

    if (!acGroup) {
      return res.status(404).json({
        success: false,
        message: 'AC Group not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'AC Group details',
      data: acGroup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Group details',
      error: error.message
    });
  }
};

// READ - Get AC Heads for dropdown
export const getAcHeadsForDropdown = async (req, res) => {
  try {
    const acHeads = await prisma.acHead.findMany({
      select: {
        ACHeadId: true,
        ACHead: true
      },
      orderBy: { ACHead: 'asc' }
    });

    res.status(200).json({
      success: true,
      message: 'AC Heads for dropdown',
      data: acHeads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Heads',
      error: error.message
    });
  }
};

// UPDATE - Update AC Group
export const updateAcGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { ACGroup, ACHeadId, System } = req.body;

    const acGroup = await prisma.acGroup.update({
      where: { ACGroupId: parseInt(id) },
      data: {
        ACGroup,
        ACHeadId: parseInt(ACHeadId),
        System
      },
      include: {
        acHead: true
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'AC Group updated successfully',
      data: acGroup
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Group not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating AC Group',
      error: error.message
    });
  }
};

// DELETE - Delete AC Group
export const deleteAcGroup = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.acGroup.delete({
      where: { ACGroupId: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'AC Group deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Group not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting AC Group',
      error: error.message
    });
  }
};