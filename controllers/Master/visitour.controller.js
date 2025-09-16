import prisma from '../../prisma/client.js';
// Get all visitours
export const getAllVisitours = async (req, res) => {
  try {
    const visitours = await prisma.visitour.findMany({
      orderBy: { VisitOurId: 'asc' }
    });
    res.json(visitours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get visitour by ID
export const getVisitourById = async (req, res) => {
  try {
    const { id } = req.params;
    const visitour = await prisma.visitour.findUnique({
      where: { VisitOurId: parseInt(id) }
    });
    
    if (!visitour) {
      return res.status(404).json({ error: 'Visitour not found' });
    }
    
    res.json(visitour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new visitour
export const createVisitour = async (req, res) => {
  try {
    const { VisitOur } = req.body;
    
    // Get the next ID
    const maxId = await prisma.visitour.aggregate({
      _max: { VisitOurId: true }
    });
    const nextId = (maxId._max.VisitOurId || 0) + 1;
    
    const newVisitour = await prisma.visitour.create({
      data: {
        VisitOurId: nextId,
        VisitOur
      }
    });
    
    res.status(201).json(newVisitour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update visitour
export const updateVisitour = async (req, res) => {
  try {
    const { id } = req.params;
    const { VisitOur } = req.body;
    
    const updatedVisitour = await prisma.visitour.update({
      where: { VisitOurId: parseInt(id) },
      data: { VisitOur }
    });
    
    res.json(updatedVisitour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete visitour
export const deleteVisitour = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.visitour.delete({
      where: { VisitOurId: parseInt(id) }
    });
    
    res.json({ message: 'Visitour deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};