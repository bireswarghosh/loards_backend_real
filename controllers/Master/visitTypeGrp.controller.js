import prisma from '../../prisma/client.js';
// Get all visittypegrps
export const getAllVisittypegrps = async (req, res) => {
  try {
    const visittypegrps = await prisma.visittypegrp.findMany({
      orderBy: { visittypegrpId: 'asc' }
    });
    res.json(visittypegrps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get visittypegrp by ID
export const getVisittypegrpById = async (req, res) => {
  try {
    const { id } = req.params;
    const visittypegrp = await prisma.visittypegrp.findUnique({
      where: { visittypegrpId: parseInt(id) }
    });
    
    if (!visittypegrp) {
      return res.status(404).json({ error: 'Visittypegrp not found' });
    }
    
    res.json(visittypegrp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new visittypegrp
export const createVisittypegrp = async (req, res) => {
  try {
    const { visittypegrp } = req.body;
    
    // Get the next ID
    const maxId = await prisma.visittypegrp.aggregate({
      _max: { visittypegrpId: true }
    });
    const nextId = (maxId._max.visittypegrpId || 0) + 1;
    
    const newVisittypegrp = await prisma.visittypegrp.create({
      data: {
        visittypegrpId: nextId,
        visittypegrp
      }
    });
    
    res.status(201).json(newVisittypegrp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update visittypegrp
export const updateVisittypegrp = async (req, res) => {
  try {
    const { id } = req.params;
    const { visittypegrp } = req.body;
    
    const updatedVisittypegrp = await prisma.visittypegrp.update({
      where: { visittypegrpId: parseInt(id) },
      data: { visittypegrp }
    });
    
    res.json(updatedVisittypegrp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete visittypegrp
export const deleteVisittypegrp = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.visittypegrp.delete({
      where: { visittypegrpId: parseInt(id) }
    });
    
    res.json({ message: 'Visittypegrp deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};