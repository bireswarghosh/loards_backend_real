import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

// Get all packages (for patient app)
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.healthPackage.findMany({
      where: { isActive: true },
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

// Get single package details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageData = await prisma.healthPackage.findUnique({
      where: { id: parseInt(id) },
      include: {
        services: true,
        _count: {
          select: { purchases: true }
        }
      }
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      package: packageData
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package'
    });
  }
});

// Purchase package
router.post('/purchase', async (req, res) => {
  try {
    const { patientId, packageId, paymentMethod, transactionId, notes } = req.body;

    // Validate patient exists
    const patient = await prisma.appointmentBookingAppPatient.findUnique({
      where: { id: parseInt(patientId) }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Validate package exists
    const packageData = await prisma.healthPackage.findUnique({
      where: { id: parseInt(packageId), isActive: true }
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or inactive'
      });
    }

    // Create purchase record
    const purchase = await prisma.packagePurchase.create({
      data: {
        patientId: parseInt(patientId),
        packageId: parseInt(packageId),
        purchaseAmount: packageData.packagePrice,
        paymentMethod: paymentMethod || 'online',
        transactionId,
        paymentStatus: 'completed',
        notes
      },
      include: {
        patient: true,
        package: {
          include: {
            services: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Package purchased successfully',
      purchase
    });
  } catch (error) {
    console.error('Error purchasing package:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase package'
    });
  }
});

// Get patient's purchased packages
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const purchases = await prisma.packagePurchase.findMany({
      where: { patientId: parseInt(patientId) },
      include: {
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
    console.error('Error fetching patient purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases'
    });
  }
});

export default router;