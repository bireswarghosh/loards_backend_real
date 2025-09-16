import prisma from '../../prisma/client.js';

export const getChiefs = async (req, res) => {
  try {
    const chiefs = await prisma.chief.findMany({
      orderBy: { chiefId: 'asc' }
    });
    res.json({ success: true, data: chiefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChief = async (req, res) => {
  try {
    const { id } = req.params;
    const chief = await prisma.chief.findUnique({
      where: { chiefId: parseInt(id) }
    });
    if (!chief) {
      return res.status(404).json({ success: false, message: 'Chief not found' });
    }
    res.json({ success: true, data: chief });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createChief = async (req, res) => {
  try {
    const { chief } = req.body;
    
    const maxChief = await prisma.chief.findFirst({
      orderBy: { chiefId: 'desc' }
    });
    const nextId = (maxChief?.chiefId || 0) + 1;
    
    const newChief = await prisma.chief.create({
      data: {
        chiefId: nextId,
        chief
      }
    });
    
    res.status(201).json({ success: true, data: newChief });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChief = async (req, res) => {
  try {
    const { id } = req.params;
    const { chief } = req.body;
    
    const updated = await prisma.chief.update({
      where: { chiefId: parseInt(id) },
      data: { chief }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChief = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.chief.delete({
      where: { chiefId: parseInt(id) }
    });
    res.json({ success: true, message: 'Chief deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};