import prisma from '../../prisma/client.js';

export const getOtTypes = async (req, res) => {
  try {
    const otTypes = await prisma.$queryRaw`SELECT * FROM ottype ORDER BY OtTypeId ASC`;
    res.json({ success: true, data: otTypes });
  } catch (error) {
    console.error('Error in getOtTypes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`SELECT * FROM ottype WHERE OtTypeId = ${parseInt(id)}`;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'OtType not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOtType = async (req, res) => {
  try {
    const { OtType } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(OtTypeId) as maxId FROM ottype`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`INSERT INTO ottype (OtTypeId, OtType) VALUES (${nextId}, ${OtType})`;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        OtTypeId: nextId, 
        OtType: OtType
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOtType = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtType } = req.body;
    await prisma.$executeRaw`UPDATE ottype SET OtType = ${OtType} WHERE OtTypeId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT * FROM ottype WHERE OtTypeId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOtType = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM ottype WHERE OtTypeId = ${parseInt(id)}`;
    res.json({ success: true, message: 'OtType deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};