import express from 'express';
import prisma from '../prisma/client.js';
const router = express.Router();

// Get all mexecutives
router.get('/', async (req, res) => {
  try {
    const mexecutives = await prisma.mexecutive.findMany();
    res.json(mexecutives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mexecutive by ID
router.get('/:id', async (req, res) => {
  try {
    const mexecutive = await prisma.mexecutive.findUnique({
      where: { MExecutiveId: parseInt(req.params.id) }
    });
    
    if (!mexecutive) {
      return res.status(404).json({ error: 'MExecutive not found' });
    }
    res.json(mexecutive);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create mexecutive
router.post('/', async (req, res) => {
  try {
    const { MExecutive, Add1, Add2, Add3, Phone } = req.body;
    const mexecutive = await prisma.mexecutive.create({
      data: { MExecutive, Add1, Add2, Add3, Phone }
    });
    res.status(201).json({ 
      ...mexecutive,
      message: 'MExecutive created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mexecutive
router.put('/:id', async (req, res) => {
  try {
    const { MExecutive, Add1, Add2, Add3, Phone } = req.body;
    const mexecutive = await prisma.mexecutive.update({
      where: { MExecutiveId: parseInt(req.params.id) },
      data: { MExecutive, Add1, Add2, Add3, Phone }
    });
    res.json({ ...mexecutive, message: 'MExecutive updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'MExecutive not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete mexecutive
router.delete('/:id', async (req, res) => {
  try {
    await prisma.mexecutive.delete({
      where: { MExecutiveId: parseInt(req.params.id) }
    });
    res.json({ message: 'MExecutive deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'MExecutive not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;