import prisma from '../../prisma/client.js';
// Get all doses
export const getAllDoses = async (req, res) => {
  try {
    const doses = await prisma.dose.findMany({
      orderBy: { DoseId: 'asc' }
    });
    res.json(doses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dose by ID
export const getDoseById = async (req, res) => {
  try {
    const { id } = req.params;
    const dose = await prisma.dose.findUnique({
      where: { DoseId: parseInt(id) }
    });
    
    if (!dose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    
    res.json(dose);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new dose
export const createDose = async (req, res) => {
  try {
    const { Dose } = req.body;
    
    // Get the next ID
    const maxId = await prisma.dose.aggregate({
      _max: { DoseId: true }
    });
    const nextId = (maxId._max.DoseId || 0) + 1;
    
    const newDose = await prisma.dose.create({
      data: {
        DoseId: nextId,
        Dose
      }
    });
    
    res.status(201).json(newDose);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update dose
export const updateDose = async (req, res) => {
  try {
    const { id } = req.params;
    const { Dose } = req.body;
    
    const updatedDose = await prisma.dose.update({
      where: { DoseId: parseInt(id) },
      data: { Dose }
    });
    
    res.json(updatedDose);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete dose
export const deleteDose = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.dose.delete({
      where: { DoseId: parseInt(id) }
    });
    
    res.json({ message: 'Dose deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};