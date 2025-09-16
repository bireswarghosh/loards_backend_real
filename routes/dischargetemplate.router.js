import express from 'express';
import prisma from '../prisma/client.js';
const router = express.Router();

// Get all discharge templates
router.get('/', async (req, res) => {
  try {
    const dischargeTemplates = await prisma.dischargetemplate.findMany();
    res.json(dischargeTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get discharge template by ID
router.get('/:id', async (req, res) => {
  try {
    const dischargeTemplate = await prisma.dischargetemplate.findUnique({
      where: { DischargeTemplateId: parseInt(req.params.id) }
    });
    
    if (!dischargeTemplate) {
      return res.status(404).json({ error: 'Discharge Template not found' });
    }
    res.json(dischargeTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create discharge template
router.post('/', async (req, res) => {
  try {
    const { DischaregeHead } = req.body;
    const dischargeTemplate = await prisma.dischargetemplate.create({
      data: { DischaregeHead }
    });
    res.status(201).json({ 
      ...dischargeTemplate,
      message: 'Discharge Template created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update discharge template
router.put('/:id', async (req, res) => {
  try {
    const { DischaregeHead } = req.body;
    const dischargeTemplate = await prisma.dischargetemplate.update({
      where: { DischargeTemplateId: parseInt(req.params.id) },
      data: { DischaregeHead }
    });
    res.json({ ...dischargeTemplate, message: 'Discharge Template updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Discharge Template not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete discharge template
router.delete('/:id', async (req, res) => {
  try {
    await prisma.dischargetemplate.delete({
      where: { DischargeTemplateId: parseInt(req.params.id) }
    });
    res.json({ message: 'Discharge Template deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Discharge Template not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;