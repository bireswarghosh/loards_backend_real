import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../prisma/client.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/banners/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all banners
router.get('/app-banners', async (req, res) => {
  try {
    const banners = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_banners ORDER BY sort_order ASC, created_at DESC`;
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload new banner
router.post('/app-banners', upload.single('banner_image'), async (req, res) => {
  try {
    const { title, description, is_active = 1, sort_order = 0 } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Banner image is required' });
    }

    const imageUrl = `/uploads/banners/${req.file.filename}`;
    
    await prisma.$executeRaw`
      INSERT INTO appointment_booking_app_banners 
      (title, description, image_url, is_active, sort_order, created_at, updated_at) 
      VALUES (${title}, ${description}, ${imageUrl}, ${parseInt(is_active)}, ${parseInt(sort_order)}, NOW(), NOW())
    `;
    
    res.json({ success: true, message: 'Banner uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update banner
router.put('/app-banners/:id', upload.single('banner_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_active = 1, sort_order = 0 } = req.body;
    
    let updateQuery = `
      UPDATE appointment_booking_app_banners 
      SET title = ?, description = ?, is_active = ?, sort_order = ?, updated_at = NOW()
    `;
    let params = [title, description, parseInt(is_active), parseInt(sort_order)];
    
    if (req.file) {
      const imageUrl = `/uploads/banners/${req.file.filename}`;
      updateQuery += `, image_url = ?`;
      params.push(imageUrl);
    }
    
    updateQuery += ` WHERE id = ?`;
    params.push(parseInt(id));
    
    await prisma.$executeRawUnsafe(updateQuery, ...params);
    
    res.json({ success: true, message: 'Banner updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete banner
router.delete('/app-banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get banner info to delete file
    const banner = await prisma.$queryRaw`SELECT * FROM appointment_booking_app_banners WHERE id = ${parseInt(id)}`;
    
    if (banner.length > 0 && banner[0].image_url) {
      const filePath = `uploads/banners/${path.basename(banner[0].image_url)}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await prisma.$executeRaw`DELETE FROM appointment_booking_app_banners WHERE id = ${parseInt(id)}`;
    
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;