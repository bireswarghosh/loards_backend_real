import prisma from '../prisma/client.js';

// CREATE - Add new AC Sub Group
export const createAcSubGrp = async (req, res) => {
  try {
    const { SubGrp, AcGroupId, system, LgrLike } = req.body;

    const acSubGrp = await prisma.acSubGrp.create({
      data: {
        SubGrp,
        AcGroupId: parseInt(AcGroupId),
        system,
        LgrLike
      },
      include: {
        acGroup: {
          include: {
            acHead: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'AC Sub Group created successfully',
      data: acSubGrp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating AC Sub Group',
      error: error.message
    });
  }
};

// READ - Get all AC Sub Groups with pagination and search
export const getAllAcSubGrps = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search ? {
      OR: [
        { SubGrp: { contains: search, mode: 'insensitive' } },
        { acGroup: { ACGroup: { contains: search, mode: 'insensitive' } } },
        { acGroup: { acHead: { ACHead: { contains: search, mode: 'insensitive' } } } }
      ]
    } : {};

    const [acSubGrps, total] = await Promise.all([
      prisma.acSubGrp.findMany({
        where,
        skip,
        take: limit,
        orderBy: { AcSubGrpId: 'desc' },
        include: {
          acGroup: {
            include: {
              acHead: true
            }
          }
        }
      }),
      prisma.acSubGrp.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'AC Sub Groups list',
      data: acSubGrps,
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
      message: 'Error fetching AC Sub Groups list',
      error: error.message
    });
  }
};

// READ - Get AC Sub Group by ID
export const getAcSubGrpById = async (req, res) => {
  try {
    const { id } = req.params;

    const acSubGrp = await prisma.acSubGrp.findUnique({
      where: { AcSubGrpId: parseInt(id) },
      include: {
        acGroup: {
          include: {
            acHead: true
          }
        }
      }
    });

    if (!acSubGrp) {
      return res.status(404).json({
        success: false,
        message: 'AC Sub Group not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'AC Sub Group details',
      data: acSubGrp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Sub Group details',
      error: error.message
    });
  }
};

// READ - Get AC Groups for dropdown
export const getAcGroupsForDropdown = async (req, res) => {
  try {
    const acGroups = await prisma.acGroup.findMany({
      select: {
        ACGroupId: true,
        ACGroup: true,
        acHead: {
          select: {
            ACHeadId: true,
            ACHead: true
          }
        }
      },
      orderBy: { ACGroup: 'asc' }
    });

    res.status(200).json({
      success: true,
      message: 'AC Groups for dropdown',
      data: acGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Groups',
      error: error.message
    });
  }
};

// UPDATE - Update AC Sub Group
export const updateAcSubGrp = async (req, res) => {
  try {
    const { id } = req.params;
    const { SubGrp, AcGroupId, system, LgrLike } = req.body;

    const acSubGrp = await prisma.acSubGrp.update({
      where: { AcSubGrpId: parseInt(id) },
      data: {
        SubGrp,
        AcGroupId: parseInt(AcGroupId),
        system,
        LgrLike
      },
      include: {
        acGroup: {
          include: {
            acHead: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'AC Sub Group updated successfully',
      data: acSubGrp
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Sub Group not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating AC Sub Group',
      error: error.message
    });
  }
};

// DELETE - Delete AC Sub Group
export const deleteAcSubGrp = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.acSubGrp.delete({
      where: { AcSubGrpId: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'AC Sub Group deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'AC Sub Group not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting AC Sub Group',
      error: error.message
    });
  }
};