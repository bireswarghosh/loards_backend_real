import prisma from '../../prisma/client.js';


export const getBeds = async (req, res) => {
  try {
    if (!prisma || !prisma.bedMaster) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database connection not established' 
      });
    }
    
    const beds = await prisma.bedMaster.findMany({
      orderBy: { BedId: 'asc' }
    });
    res.json({ success: true, data: beds });
  } catch (error) {
    console.error('Error in getBeds:', error);
    res.status(500).json({ success: false, error: error.message || 'An error occurred while fetching beds' });
  }
};


export const getBedById = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await prisma.bedMaster.findUnique({
      where: { BedId: parseInt(id) }
    });
    
    if (!bed) {
      return res.status(404).json({ success: false, error: 'Bed not found' });
    }
    
    res.json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const createBed = async (req, res) => {
  try {
    const { BedId, ...bedData } = req.body;
    const bed = await prisma.bedMaster.create({
      data: bedData
    });
    res.status(201).json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await prisma.bedMaster.update({
      where: { BedId: parseInt(id) },
      data: req.body
    });
    res.json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




export const deleteBed = async (req, res) => {
  try {

    const { id } = req.params;
    await prisma.bedMaster.delete({
      where: { BedId: parseInt(id) }
    });

    res.json({ success: true, message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


