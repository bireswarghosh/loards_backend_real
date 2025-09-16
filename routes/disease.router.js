import express from 'express';
import prisma from '../prisma/client.js';
const router = express.Router();

// Get all diseases
router.get('/', async (req, res) => {
  try {
    const diseases = await prisma.disease.findMany();
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get disease by ID
router.get('/:id', async (req, res) => {
  try {
    const disease = await prisma.disease.findUnique({
      where: { DiseaseId: parseInt(req.params.id) }
    });
    
    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.json(disease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create disease
router.post('/', async (req, res) => {
  try {
    const { Disease, Diseasecode } = req.body;
    const disease = await prisma.disease.create({
      data: { Disease, Diseasecode }
    });
    res.status(201).json({ 
      ...disease,
      message: 'Disease created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update disease
router.put('/:id', async (req, res) => {
  try {
    const { Disease, Diseasecode } = req.body;
    const disease = await prisma.disease.update({
      where: { DiseaseId: parseInt(req.params.id) },
      data: { Disease, Diseasecode }
    });
    res.json({ ...disease, message: 'Disease updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete disease
router.delete('/:id', async (req, res) => {
  try {
    await prisma.disease.delete({
      where: { DiseaseId: parseInt(req.params.id) }
    });
    res.json({ message: 'Disease deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;