import prisma from '../../prisma/client.js';

export const getDayCares = async (req, res) => {
  try {
    const dayCares = await prisma.$queryRaw`SELECT * FROM daycare ORDER BY DayCareId ASC`;
    res.json({ success: true, data: dayCares });
  } catch (error) {
    console.error('Error in getDayCares:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDayCareById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`SELECT * FROM daycare WHERE DayCareId = ${parseInt(id)}`;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'DayCare not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDayCare = async (req, res) => {
  try {
    const { DayCare, Rate } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(DayCareId) as maxId FROM daycare`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 3;
    
    await prisma.$executeRaw`INSERT INTO daycare (DayCareId, DayCare, Rate) VALUES (${nextId}, ${DayCare}, ${Rate})`;
    
    // Return success without fetching the record
    res.status(201).json({ 
      success: true, 
      data: { 
        DayCareId: nextId, 
        DayCare: DayCare, 
        Rate: Rate 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDayCare = async (req, res) => {
  try {
    const { id } = req.params;
    const { DayCare, Rate } = req.body;
    await prisma.$executeRaw`UPDATE daycare SET DayCare = ${DayCare}, Rate = ${Rate} WHERE DayCareId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT * FROM daycare WHERE DayCareId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDayCare = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM daycare WHERE DayCareId = ${parseInt(id)}`;
    res.json({ success: true, message: 'DayCare deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};