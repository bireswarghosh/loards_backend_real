import prisma from '../../prisma/client.js';

export const getOtSlots = async (req, res) => {
  try {
    const otSlots = await prisma.$queryRaw`
      SELECT 
        os.OTSlotId,
        os.OtMasterId,
        os.OTSlot,
        os.Rate,
        os.DepGroupId,
        om.OtMaster,
        dg.DepGroup
      FROM otslot os
      LEFT JOIN otmaster om ON os.OtMasterId = om.OtMasterId
      LEFT JOIN depgroup dg ON os.DepGroupId = dg.DepGroupId
      ORDER BY os.OTSlotId ASC
    `;
    res.json({ success: true, data: otSlots });
  } catch (error) {
    console.error('Error in getOtSlots:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOtSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`
      SELECT 
        os.OTSlotId,
        os.OtMasterId,
        os.OTSlot,
        os.Rate,
        os.DepGroupId,
        om.OtMaster,
        dg.DepGroup
      FROM otslot os
      LEFT JOIN otmaster om ON os.OtMasterId = om.OtMasterId
      LEFT JOIN depgroup dg ON os.DepGroupId = dg.DepGroupId
      WHERE os.OTSlotId = ${parseInt(id)}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'OtSlot not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOtSlot = async (req, res) => {
  try {
    const { OtMasterId, OTSlot, Rate, DepGroupId } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(OTSlotId) as maxId FROM otslot`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`
      INSERT INTO otslot (OTSlotId, OtMasterId, OTSlot, Rate, DepGroupId) 
      VALUES (${nextId}, ${OtMasterId}, ${OTSlot}, ${Rate}, ${DepGroupId})
    `;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        OTSlotId: nextId, 
        OtMasterId, 
        OTSlot, 
        Rate, 
        DepGroupId 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOtSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { OtMasterId, OTSlot, Rate, DepGroupId } = req.body;
    
    await prisma.$executeRaw`
      UPDATE otslot 
      SET OtMasterId = ${OtMasterId}, OTSlot = ${OTSlot}, Rate = ${Rate}, DepGroupId = ${DepGroupId}
      WHERE OTSlotId = ${parseInt(id)}
    `;
    
    const result = await prisma.$queryRaw`
      SELECT 
        os.OTSlotId,
        os.OtMasterId,
        os.OTSlot,
        os.Rate,
        os.DepGroupId,
        om.OtMaster,
        dg.DepGroup
      FROM otslot os
      LEFT JOIN otmaster om ON os.OtMasterId = om.OtMasterId
      LEFT JOIN depgroup dg ON os.DepGroupId = dg.DepGroupId
      WHERE os.OTSlotId = ${parseInt(id)}
    `;
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOtSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM otslot WHERE OTSlotId = ${parseInt(id)}`;
    res.json({ success: true, message: 'OtSlot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper endpoints for dropdowns
export const getOtMasters = async (req, res) => {
  try {
    const otMasters = await prisma.$queryRaw`SELECT OtMasterId, OtMaster FROM otmaster ORDER BY OtMaster ASC`;
    res.json({ success: true, data: otMasters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepGroups = async (req, res) => {
  try {
    const depGroups = await prisma.$queryRaw`SELECT DepGroupId, DepGroup FROM depgroup ORDER BY DepGroup ASC`;
    res.json({ success: true, data: depGroups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};