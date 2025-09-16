import prisma from '../../prisma/client.js';

export const getOtItems = async (req, res) => {
  try {
    const otItems = await prisma.$queryRaw`
      SELECT 
        oi.OtItemId,
        oi.OtItem,
        oi.OtCategoryId,
        oi.Rate,
        oi.Unit,
        oi.ServiceChYN,
        oc.OtCategory
      FROM otitem oi
      LEFT JOIN otcategory oc ON oi.OtCategoryId = oc.OtCategoryId
      ORDER BY oi.OtItemId ASC
    `;
    res.json({ success: true, data: otItems });
  } catch (error) {
    console.error('Error in getOtItems:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`
      SELECT 
        oi.OtItemId,
        oi.OtItem,
        oi.OtCategoryId,
        oi.Rate,
        oi.Unit,
        oi.ServiceChYN,
        oc.OtCategory
      FROM otitem oi
      LEFT JOIN otcategory oc ON oi.OtCategoryId = oc.OtCategoryId
      WHERE oi.OtItemId = ${parseInt(id)}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'OtItem not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOtItem = async (req, res) => {
  try {
    const { OtItem, OtCategoryId, Rate, Unit, ServiceChYN } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(OtItemId) as maxId FROM otitem`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`
      INSERT INTO otitem (OtItemId, OtItem, OtCategoryId, Rate, Unit, ServiceChYN) 
      VALUES (${nextId}, ${OtItem}, ${OtCategoryId}, ${Rate}, ${Unit}, ${ServiceChYN})
    `;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        OtItemId: nextId, 
        OtItem, 
        OtCategoryId, 
        Rate, 
        Unit, 
        ServiceChYN 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOtItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtItem, OtCategoryId, Rate, Unit, ServiceChYN } = req.body;
    
    await prisma.$executeRaw`
      UPDATE otitem 
      SET OtItem = ${OtItem}, OtCategoryId = ${OtCategoryId}, Rate = ${Rate}, Unit = ${Unit}, ServiceChYN = ${ServiceChYN}
      WHERE OtItemId = ${parseInt(id)}
    `;
    
    const result = await prisma.$queryRaw`
      SELECT 
        oi.OtItemId,
        oi.OtItem,
        oi.OtCategoryId,
        oi.Rate,
        oi.Unit,
        oi.ServiceChYN,
        oc.OtCategory
      FROM otitem oi
      LEFT JOIN otcategory oc ON oi.OtCategoryId = oc.OtCategoryId
      WHERE oi.OtItemId = ${parseInt(id)}
    `;
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOtItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM otitem WHERE OtItemId = ${parseInt(id)}`;
    res.json({ success: true, message: 'OtItem deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtCategories = async (req, res) => {
  try {
    const otCategories = await prisma.$queryRaw`SELECT OtCategoryId, OtCategory FROM otcategory ORDER BY OtCategory ASC`;
    res.json({ success: true, data: otCategories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};