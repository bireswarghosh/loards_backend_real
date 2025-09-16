import express from 'express';
import prisma from '../../prisma/client.js';

const router = express.Router();

// Get all religions
router.get('/', async (req, res) => {
  try {
    const religions = await prisma.religion.findMany({
      orderBy: { ReligionId: 'asc' }
    });
    res.json({ success: true, data: religions });
  } catch (error) {
    console.error('Error fetching religions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get religion by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const religion = await prisma.religion.findUnique({
      where: { ReligionId: parseInt(id) }
    });
    
    if (!religion) {
      return res.status(404).json({ success: false, error: 'Religion not found' });
    }
    
    res.json({ success: true, data: religion });
  } catch (error) {
    console.error('Error fetching religion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new religion
router.post('/', async (req, res) => {
  try {
    const { Religion } = req.body;
    
    if (!Religion) {
      return res.status(400).json({ success: false, error: 'Religion name is required' });
    }
    
    const religion = await prisma.religion.create({
      data: { Religion }
    });
    
    res.status(201).json({ success: true, data: religion });
  } catch (error) {
    console.error('Error creating religion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update religion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Religion } = req.body;
    
    if (!Religion) {
      return res.status(400).json({ success: false, error: 'Religion name is required' });
    }
    
    const religion = await prisma.religion.update({
      where: { ReligionId: parseInt(id) },
      data: { Religion }
    });
    
    res.json({ success: true, data: religion });
  } catch (error) {
    console.error('Error updating religion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete religion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.religion.delete({
      where: { ReligionId: parseInt(id) }
    });
    
    res.json({ success: true, message: 'Religion deleted successfully' });
  } catch (error) {
    console.error('Error deleting religion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;