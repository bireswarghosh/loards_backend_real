import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

// Get all social media links
router.get('/app-social-media', async (req, res) => {
  try {
    const socialMedia = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_social_media ORDER BY sort_order ASC`;
    res.json({ success: true, data: socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new social media link
router.post('/app-social-media', async (req, res) => {
  try {
    const { platform_name, platform_url, icon_name, is_active = 1, sort_order = 0 } = req.body;
    
    if (!platform_name || !platform_url) {
      return res.status(400).json({ success: false, message: 'Platform name and URL are required' });
    }

    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_social_media 
      (platform_name, platform_url, icon_name, is_active, sort_order, created_at, updated_at) 
      VALUES (${platform_name}, ${platform_url}, ${icon_name}, ${parseInt(is_active)}, ${parseInt(sort_order)}, NOW(), NOW())
    `;
    
    res.json({ success: true, message: 'Social media link added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update social media link
router.put('/app-social-media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform_name, platform_url, icon_name, is_active = 1, sort_order = 0 } = req.body;
    
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_social_media 
      SET platform_name = ${platform_name}, platform_url = ${platform_url}, icon_name = ${icon_name}, 
          is_active = ${parseInt(is_active)}, sort_order = ${parseInt(sort_order)}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `;
    
    res.json({ success: true, message: 'Social media link updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete social media link
router.delete('/app-social-media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.$executeRaw`DELETE FROM appointment_booking_app_social_media WHERE id = ${parseInt(id)}`;
    
    res.json({ success: true, message: 'Social media link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;