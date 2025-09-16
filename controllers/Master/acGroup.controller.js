import prisma from '../../prisma/client.js';

export const getAcGroups = async (req, res) => {
  try {
    const acGroups = await prisma.$queryRaw`
      SELECT ag.*, ah.ACHead
      FROM acgroup ag
      LEFT JOIN achead ah ON ag.ACHeadId = ah.ACHeadId
      ORDER BY ag.ACGroupId ASC
    `;
    res.json({ success: true, data: acGroups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAcGroup = async (req, res) => {
  try {
    const { ACGroup, ACHeadId, System } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(ACGroupId) as maxId FROM acgroup`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`INSERT INTO acgroup (ACGroupId, ACGroup, ACHeadId, System) VALUES (${nextId}, ${ACGroup}, ${ACHeadId}, ${System})`;
    
    res.status(201).json({ success: true, data: { ACGroupId: nextId, ACGroup, ACHeadId, System } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAcGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { ACGroup, ACHeadId, System } = req.body;
    await prisma.$executeRaw`UPDATE acgroup SET ACGroup = ${ACGroup}, ACHeadId = ${ACHeadId}, System = ${System} WHERE ACGroupId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT ag.*, ah.ACHead FROM acgroup ag LEFT JOIN achead ah ON ag.ACHeadId = ah.ACHeadId WHERE ag.ACGroupId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAcGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM acgroup WHERE ACGroupId = ${parseInt(id)}`;
    res.json({ success: true, message: 'AcGroup deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAcHeadsForDropdown = async (req, res) => {
  try {
    const acHeads = await prisma.$queryRaw`SELECT ACHeadId, ACHead FROM achead ORDER BY ACHead ASC`;
    res.json({ success: true, data: acHeads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};