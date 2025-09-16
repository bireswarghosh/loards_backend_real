import prisma from '../../prisma/client.js';

// GET package with includes
export const getPackageWithIncludes = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    const packageData = await prisma.package.findUnique({
      where: { PackageId: parseInt(packageId) },
      include: {
        includes: true
      }
    });
    
    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: packageData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET includes by package ID
export const getIncludesByPackageId = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    const includes = await prisma.packInclude.findMany({
      where: { PackageId: parseInt(packageId) },
      orderBy: { IncludeId: 'asc' }
    });
    
    res.json({ success: true, data: includes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new include
export const createInclude = async (req, res) => {
  try {
    const { PackageId, IncHead, IncHeadRate } = req.body;
    
    // Get next IncludeId for this package
    const lastInclude = await prisma.packInclude.findFirst({
      where: { PackageId: parseInt(PackageId) },
      orderBy: { IncludeId: 'desc' }
    });
    const nextIncludeId = lastInclude ? lastInclude.IncludeId + 1 : 1;
    
    const newInclude = await prisma.packInclude.create({
      data: {
        IncludeId: nextIncludeId,
        PackageId: parseInt(PackageId),
        IncHead,
        IncHeadRate: IncHeadRate ? parseFloat(IncHeadRate) : null
      }
    });
    
    res.status(201).json({ success: true, data: newInclude });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE include
export const updateInclude = async (req, res) => {
  try {
    const { packageId, includeId } = req.params;
    const { IncHead, IncHeadRate } = req.body;
    
    const updatedInclude = await prisma.packInclude.update({
      where: {
        IncludeId_PackageId: {
          IncludeId: parseInt(includeId),
          PackageId: parseInt(packageId)
        }
      },
      data: {
        IncHead,
        IncHeadRate: IncHeadRate ? parseFloat(IncHeadRate) : null
      }
    });
    
    res.json({ success: true, data: updatedInclude });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Include not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE include
export const deleteInclude = async (req, res) => {
  try {
    const { packageId, includeId } = req.params;
    
    await prisma.packInclude.delete({
      where: {
        IncludeId_PackageId: {
          IncludeId: parseInt(includeId),
          PackageId: parseInt(packageId)
        }
      }
    });
    
    res.json({ success: true, message: 'Include deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Include not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};