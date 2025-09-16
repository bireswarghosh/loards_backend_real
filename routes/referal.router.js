import express from 'express';
import prisma from '../prisma/client.js';
const router = express.Router();

// Get all referals
router.get('/', async (req, res) => {
  try {
    const referals = await prisma.referal.findMany({
      include: {
        mexecutive: true
      }
    });
    res.json(referals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get referal by ID
router.get('/:id', async (req, res) => {
  try {
    const referal = await prisma.referal.findUnique({
      where: { ReferalId: parseInt(req.params.id) },
      include: {
        mexecutive: true
      }
    });
    
    if (!referal) {
      return res.status(404).json({ error: 'Referal not found' });
    }
    res.json(referal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create referal
router.post('/', async (req, res) => {
  try {
    const { Referal, PhoneNo, MExecutiveId } = req.body;
    const referal = await prisma.referal.create({
      data: { Referal, PhoneNo, MExecutiveId },
      include: {
        mexecutive: true
      }
    });
    res.status(201).json({ 
      ...referal,
      message: 'Referal created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update referal
router.put('/:id', async (req, res) => {
  try {
    const { Referal, PhoneNo, MExecutiveId } = req.body;
    const referal = await prisma.referal.update({
      where: { ReferalId: parseInt(req.params.id) },
      data: { Referal, PhoneNo, MExecutiveId },
      include: {
        mexecutive: true
      }
    });
    res.json({ ...referal, message: 'Referal updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Referal not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete referal
router.delete('/:id', async (req, res) => {
  try {
    await prisma.referal.delete({
      where: { ReferalId: parseInt(req.params.id) }
    });
    res.json({ message: 'Referal deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Referal not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;