import prisma from '../../prisma/client.js';

export const getOutdoorOtherCharges = async (req, res) => {
  try {
    const charges = await prisma.outdoorothercharge.findMany({
      orderBy: { OtherChId: 'asc' }
    });
    res.json({ success: true, data: charges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOutdoorOtherCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const charge = await prisma.outdoorothercharge.findUnique({
      where: { OtherChId: parseInt(id) }
    });
    if (!charge) {
      return res.status(404).json({ success: false, message: 'Charge not found' });
    }
    res.json({ success: true, data: charge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOutdoorOtherCharge = async (req, res) => {
  try {
    const { OtherCharge, Rate, UNIT, OT, OTSLOTID } = req.body;
    
    const maxCharge = await prisma.outdoorothercharge.findFirst({
      orderBy: { OtherChId: 'desc' }
    });
    const nextId = (maxCharge?.OtherChId || 0) + 1;
    
    const newCharge = await prisma.outdoorothercharge.create({
      data: {
        OtherChId: nextId,
        OtherCharge,
        Rate: Rate ? parseFloat(Rate) : null,
        UNIT,
        OT,
        OTSLOTID: OTSLOTID ? parseInt(OTSLOTID) : null
      }
    });
    
    res.status(201).json({ success: true, data: newCharge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOutdoorOtherCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtherCharge, Rate, UNIT, OT, OTSLOTID } = req.body;
    
    const updated = await prisma.outdoorothercharge.update({
      where: { OtherChId: parseInt(id) },
      data: {
        OtherCharge,
        Rate: Rate ? parseFloat(Rate) : null,
        UNIT,
        OT,
        OTSLOTID: OTSLOTID ? parseInt(OTSLOTID) : null
      }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOutdoorOtherCharge = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.outdoorothercharge.delete({
      where: { OtherChId: parseInt(id) }
    });
    res.json({ success: true, message: 'Charge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};