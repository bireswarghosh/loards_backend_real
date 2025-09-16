import prisma from '../../prisma/client.js';

export const getDiagos = async (req, res) => {
  try {
    const diagos = await prisma.diago.findMany({
      orderBy: { diagoId: 'asc' }
    });
    res.json({ success: true, data: diagos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDiago = async (req, res) => {
  try {
    const { id } = req.params;
    const diago = await prisma.diago.findUnique({
      where: { diagoId: parseInt(id) }
    });
    if (!diago) {
      return res.status(404).json({ success: false, message: 'Diago not found' });
    }
    res.json({ success: true, data: diago });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDiago = async (req, res) => {
  try {
    const { diago } = req.body;
    
    const maxDiago = await prisma.diago.findFirst({
      orderBy: { diagoId: 'desc' }
    });
    const nextId = (maxDiago?.diagoId || 0) + 1;
    
    const newDiago = await prisma.diago.create({
      data: {
        diagoId: nextId,
        diago
      }
    });
    
    res.status(201).json({ success: true, data: newDiago });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDiago = async (req, res) => {
  try {
    const { id } = req.params;
    const { diago } = req.body;
    
    const updated = await prisma.diago.update({
      where: { diagoId: parseInt(id) },
      data: { diago }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDiago = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.diago.delete({
      where: { diagoId: parseInt(id) }
    });
    res.json({ success: true, message: 'Diago deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};