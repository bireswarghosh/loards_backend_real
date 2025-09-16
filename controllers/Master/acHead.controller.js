import prisma from '../../prisma/client.js';

export const getAcHeads = async (req, res) => {
  try {
    const acHeads = await prisma.$queryRaw`SELECT * FROM achead ORDER BY ACHeadId ASC`;
    res.json({ success: true, data: acHeads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAcHead = async (req, res) => {
  try {
    const { ACHead, System } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(ACHeadId) as maxId FROM achead`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`INSERT INTO achead (ACHeadId, ACHead, System) VALUES (${nextId}, ${ACHead}, ${System})`;
    
    res.status(201).json({ success: true, data: { ACHeadId: nextId, ACHead, System } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAcHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { ACHead, System } = req.body;
    await prisma.$executeRaw`UPDATE achead SET ACHead = ${ACHead}, System = ${System} WHERE ACHeadId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT * FROM achead WHERE ACHeadId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAcHead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM achead WHERE ACHeadId = ${parseInt(id)}`;
    res.json({ success: true, message: 'AcHead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};