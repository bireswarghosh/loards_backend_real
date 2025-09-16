import prisma from '../../prisma/client.js';
// Get all visittypes
export const getAllVisittypes = async (req, res) => {
  try {
    const visittypes = await prisma.visittype.findMany({
      orderBy: { VisitTypeId: 'asc' }
    });
    res.json(visittypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get visittype by ID
export const getVisittypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const visittype = await prisma.visittype.findUnique({
      where: { VisitTypeId: parseInt(id) }
    });
    
    if (!visittype) {
      return res.status(404).json({ error: 'Visittype not found' });
    }
    
    res.json(visittype);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new visittype
export const createVisittype = async (req, res) => {
  try {
    const { VisitType, RateYN, SrvChYN, RefferaId, REG, grp } = req.body;
    
    // Get the next ID
    const maxId = await prisma.visittype.aggregate({
      _max: { VisitTypeId: true }
    });
    const nextId = (maxId._max.VisitTypeId || 0) + 1;
    
    const newVisittype = await prisma.visittype.create({
      data: {
        VisitTypeId: nextId,
        VisitType,
        RateYN,
        SrvChYN,
        RefferaId: RefferaId ? parseInt(RefferaId) : null,
        REG,
        grp: grp ? parseInt(grp) : null
      }
    });
    
    res.status(201).json(newVisittype);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update visittype
export const updateVisittype = async (req, res) => {
  try {
    const { id } = req.params;
    const { VisitType, RateYN, SrvChYN, RefferaId, REG, grp } = req.body;
    
    const updatedVisittype = await prisma.visittype.update({
      where: { VisitTypeId: parseInt(id) },
      data: {
        VisitType,
        RateYN,
        SrvChYN,
        RefferaId: RefferaId ? parseInt(RefferaId) : null,
        REG,
        grp: grp ? parseInt(grp) : null
      }
    });
    
    res.json(updatedVisittype);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete visittype
export const deleteVisittype = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.visittype.delete({
      where: { VisitTypeId: parseInt(id) }
    });
    
    res.json({ message: 'Visittype deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};