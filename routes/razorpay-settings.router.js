import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

// Get Razorpay settings
router.get('/razorpay-settings', async (req, res) => {
  try {
    const settings = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_rozerpaysecrect LIMIT 1`;
    res.json({ success: true, data: settings[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Razorpay settings
router.put('/razorpay-settings', async (req, res) => {
  try {
    const { razorpay_key, razorpay_secret } = req.body;
    
    const existing = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_rozerpaysecrect LIMIT 1`;
    
    if (existing.length > 0) {
      await prisma.$executeRaw`UPDATE appointment_booking_app_rozerpaysecrect SET razorpay_key = ${razorpay_key}, razorpay_secret = ${razorpay_secret}, updated_at = NOW() WHERE id = ${existing[0].id}`;
    } else {
      await prisma.$executeRaw`INSERT INTO appointment_booking_app_rozerpaysecrect (razorpay_key, razorpay_secret, created_at, updated_at) VALUES (${razorpay_key}, ${razorpay_secret}, NOW(), NOW())`;
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;