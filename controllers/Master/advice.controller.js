import prisma from '../../prisma/client.js';
// Get all advices
export const getAllAdvices = async (req, res) => {
  try {
    const advices = await prisma.advice.findMany({
      orderBy: { AdviceId: 'asc' }
    });
    res.json(advices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get advice by ID
export const getAdviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const advice = await prisma.advice.findUnique({
      where: { AdviceId: parseInt(id) }
    });
    
    if (!advice) {
      return res.status(404).json({ error: 'Advice not found' });
    }
    
    res.json(advice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new advice
export const createAdvice = async (req, res) => {
  try {
    const { Advice } = req.body;
    
    // Get the next ID
    const maxId = await prisma.advice.aggregate({
      _max: { AdviceId: true }
    });
    const nextId = (maxId._max.AdviceId || 0) + 1;
    
    const newAdvice = await prisma.advice.create({
      data: {
        AdviceId: nextId,
        Advice
      }
    });
    
    res.status(201).json(newAdvice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update advice
export const updateAdvice = async (req, res) => {
  try {
    const { id } = req.params;
    const { Advice } = req.body;
    
    const updatedAdvice = await prisma.advice.update({
      where: { AdviceId: parseInt(id) },
      data: { Advice }
    });
    
    res.json(updatedAdvice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete advice
export const deleteAdvice = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.advice.delete({
      where: { AdviceId: parseInt(id) }
    });
    
    res.json({ message: 'Advice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};