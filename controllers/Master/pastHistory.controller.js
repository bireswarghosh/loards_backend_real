import prisma from '../../prisma/client.js';

export const getPastHistories = async (req, res) => {
  try {
    const histories = await prisma.pasthistory.findMany({
      orderBy: { pasthistoryId: 'asc' }
    });
    res.json({ success: true, data: histories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPastHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await prisma.pasthistory.findUnique({
      where: { pasthistoryId: parseInt(id) }
    });
    if (!history) {
      return res.status(404).json({ success: false, message: 'Past history not found' });
    }
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPastHistory = async (req, res) => {
  try {
    const { pasthistory } = req.body;
    
    const maxHistory = await prisma.pasthistory.findFirst({
      orderBy: { pasthistoryId: 'desc' }
    });
    const nextId = (maxHistory?.pasthistoryId || 0) + 1;
    
    const newHistory = await prisma.pasthistory.create({
      data: {
        pasthistoryId: nextId,
        pasthistory
      }
    });
    
    res.status(201).json({ success: true, data: newHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePastHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { pasthistory } = req.body;
    
    const updated = await prisma.pasthistory.update({
      where: { pasthistoryId: parseInt(id) },
      data: { pasthistory }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePastHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pasthistory.delete({
      where: { pasthistoryId: parseInt(id) }
    });
    res.json({ success: true, message: 'Past history deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};