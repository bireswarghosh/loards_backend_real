import express from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../prisma/client.js';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/packages/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed!'), false);
    }
  }
});

// Get all packages (admin view)
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.healthPackage.findMany({
      include: {
        services: true,
        _count: {
          select: { purchases: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      packages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages'
    });
  }
});

// Create new package
router.post('/', upload.single('packageImage'), async (req, res) => {
  try {
    const { packageName, packagePrice, packageDescription } = req.body;
    const packageImage = req.file ? req.file.filename : null;
    
    // Parse services from FormData
    const services = [];
    let index = 0;
    while (req.body[`services[${index}][serviceName]`]) {
      services.push({
        serviceName: req.body[`services[${index}][serviceName]`],
        serviceDescription: req.body[`services[${index}][serviceDescription]`] || null
      });
      index++;
    }

    const packageData = await prisma.healthPackage.create({
      data: {
        packageName,
        packagePrice: parseFloat(packagePrice),
        packageDescription,
        packageImage,
        services: {
          create: services.map(service => ({
            serviceName: service.serviceName,
            serviceDescription: service.serviceDescription || null
          }))
        }
      },
      include: {
        services: true
      }
    });

    res.json({
      success: true,
      message: 'Package created successfully',
      package: packageData
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package',
      error: error.message
    });
  }
});

// Update package
router.put('/:id', upload.single('packageImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { packageName, packagePrice, packageDescription, isActive } = req.body;
    const packageImage = req.file ? req.file.filename : undefined;
    
    // Parse services from FormData
    const services = [];
    let index = 0;
    while (req.body[`services[${index}][serviceName]`]) {
      services.push({
        serviceName: req.body[`services[${index}][serviceName]`],
        serviceDescription: req.body[`services[${index}][serviceDescription]`] || null
      });
      index++;
    }

    // Update package
    const updateData = {
      packageName,
      packagePrice: parseFloat(packagePrice),
      packageDescription,
      isActive
    };
    
    if (packageImage) {
      updateData.packageImage = packageImage;
    }

    await prisma.healthPackage.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Delete existing services
    await prisma.packageService.deleteMany({
      where: { packageId: parseInt(id) }
    });

    // Create new services
    if (services && services.length > 0) {
      await prisma.packageService.createMany({
        data: services.map(service => ({
          packageId: parseInt(id),
          serviceName: service.serviceName,
          serviceDescription: service.serviceDescription || null
        }))
      });
    }

    // Get updated package with services
    const updatedPackage = await prisma.healthPackage.findUnique({
      where: { id: parseInt(id) },
      include: {
        services: true
      }
    });

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package'
    });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if package has purchases
    const purchaseCount = await prisma.packagePurchase.count({
      where: { packageId: parseInt(id) }
    });

    if (purchaseCount > 0) {
      // Don't delete, just deactivate
      await prisma.healthPackage.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
      });

      return res.json({
        success: true,
        message: 'Package deactivated (has existing purchases)'
      });
    }

    // Delete package and its services
    await prisma.healthPackage.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package'
    });
  }
});

// Get all purchases (admin view)
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await prisma.packagePurchase.findMany({
      include: {
        patient: true,
        package: {
          include: {
            services: true
          }
        }
      },
      orderBy: { purchaseDate: 'desc' }
    });

    res.json({
      success: true,
      purchases
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases'
    });
  }
});

// Update purchase status
router.put('/purchases/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, notes } = req.body;

    const purchase = await prisma.packagePurchase.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus,
        notes
      },
      include: {
        patient: true,
        package: true
      }
    });

    res.json({
      success: true,
      message: 'Purchase status updated successfully',
      purchase
    });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase status'
    });
  }
});

// Get package statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalPackages = await prisma.healthPackage.count();
    const activePackages = await prisma.healthPackage.count({
      where: { isActive: true }
    });
    const totalPurchases = await prisma.packagePurchase.count();
    const totalRevenue = await prisma.packagePurchase.aggregate({
      _sum: {
        purchaseAmount: true
      },
      where: {
        paymentStatus: 'completed'
      }
    });

    const popularPackages = await prisma.healthPackage.findMany({
      include: {
        _count: {
          select: { purchases: true }
        }
      },
      orderBy: {
        purchases: {
          _count: 'desc'
        }
      },
      take: 5
    });

    res.json({
      success: true,
      statistics: {
        totalPackages,
        activePackages,
        totalPurchases,
        totalRevenue: totalRevenue._sum.purchaseAmount || 0,
        popularPackages
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;