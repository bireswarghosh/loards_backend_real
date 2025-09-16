import prisma from '../../prisma/client.js';

export const getOtMasters = async (req, res) => {
  try {
    const otMasters = await prisma.$queryRaw`SELECT * FROM otmaster ORDER BY OtMasterId ASC`;
    res.json({ success: true, data: otMasters });
  } catch (error) {
    console.error('Error in getOtMasters:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtMasterById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`SELECT * FROM otmaster WHERE OtMasterId = ${parseInt(id)}`;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'OtMaster not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOtMaster = async (req, res) => {
  try {
    const { OtMaster, Rate } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(OtMasterId) as maxId FROM otmaster`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`INSERT INTO otmaster (OtMasterId, OtMaster, Rate) VALUES (${nextId}, ${OtMaster}, ${Rate})`;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        OtMasterId: nextId, 
        OtMaster: OtMaster, 
        Rate: Rate 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOtMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtMaster, Rate } = req.body;
    await prisma.$executeRaw`UPDATE otmaster SET OtMaster = ${OtMaster}, Rate = ${Rate} WHERE OtMasterId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT * FROM otmaster WHERE OtMasterId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOtMaster = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM otmaster WHERE OtMasterId = ${parseInt(id)}`;
    res.json({ success: true, message: 'OtMaster deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};