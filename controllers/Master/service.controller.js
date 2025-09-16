import prisma from '../../prisma/client.js';

export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { SERVICEId: 'asc' }
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { SERVICEId: parseInt(id) }
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { SERVICE, SERVICECODE } = req.body;
    
    const maxService = await prisma.service.findFirst({
      orderBy: { SERVICEId: 'desc' }
    });
    const nextId = (maxService?.SERVICEId || 0) + 1;
    
    const newService = await prisma.service.create({
      data: {
        SERVICEId: nextId,
        SERVICE,
        SERVICECODE: SERVICECODE ? parseFloat(SERVICECODE) : null
      }
    });
    
    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { SERVICE, SERVICECODE } = req.body;
    
    const updated = await prisma.service.update({
      where: { SERVICEId: parseInt(id) },
      data: {
        SERVICE,
        SERVICECODE: SERVICECODE ? parseFloat(SERVICECODE) : null
      }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({
      where: { SERVICEId: parseInt(id) }
    });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};