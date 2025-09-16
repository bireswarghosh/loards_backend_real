import prisma from '../../prisma/client.js';

export const getOtCategories = async (req, res) => {
  try {
    const otCategories = await prisma.$queryRaw`SELECT * FROM otcategory ORDER BY OtCategoryId ASC`;
    res.json({ success: true, data: otCategories });
  } catch (error) {
    console.error('Error in getOtCategories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`SELECT * FROM otcategory WHERE OtCategoryId = ${parseInt(id)}`;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'OtCategory not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOtCategory = async (req, res) => {
  try {
    const { OtCategory } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(OtCategoryId) as maxId FROM otcategory`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`INSERT INTO otcategory (OtCategoryId, OtCategory) VALUES (${nextId}, ${OtCategory})`;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        OtCategoryId: nextId, 
        OtCategory: OtCategory
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOtCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtCategory } = req.body;
    await prisma.$executeRaw`UPDATE otcategory SET OtCategory = ${OtCategory} WHERE OtCategoryId = ${parseInt(id)}`;
    const result = await prisma.$queryRaw`SELECT * FROM otcategory WHERE OtCategoryId = ${parseInt(id)}`;
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOtCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM otcategory WHERE OtCategoryId = ${parseInt(id)}`;
    res.json({ success: true, message: 'OtCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};