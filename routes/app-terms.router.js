import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

// Get App Terms & Conditions
router.get('/app-terms', async (req, res) => {
  try {
    const terms = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_terms_conditions LIMIT 1`;
    res.json({ success: true, data: terms[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update App Terms & Conditions
router.put('/app-terms', async (req, res) => {
  try {
    const { terms_content, privacy_policy, about_us } = req.body;
    
    const existing = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_terms_conditions LIMIT 1`;
    
    if (existing.length > 0) {
      await prisma.$executeRaw`UPDATE appointment_booking_app_terms_conditions SET terms_content = ${terms_content}, privacy_policy = ${privacy_policy}, about_us = ${about_us}, updated_at = NOW() WHERE id = ${existing[0].id}`;
    } else {
      await prisma.$executeRaw`INSERT INTO appointment_booking_app_terms_conditions (terms_content, privacy_policy, about_us, created_at, updated_at) VALUES (${terms_content}, ${privacy_policy}, ${about_us}, NOW(), NOW())`;
    }
    
    res.json({ success: true, message: 'Terms & Conditions updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;