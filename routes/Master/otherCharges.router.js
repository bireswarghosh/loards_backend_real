import express from 'express';
import prisma from '../../prisma/client.js';

const router = express.Router();

// Get all other charges with relations
router.get('/', async (req, res) => {
  try {
    const otherCharges = await prisma.$queryRaw`
      SELECT 
        oc.*,
        dg.DepGroup as departmentGroupName,
        bph.BillPrintHead as billPrintHeadName
      FROM othercharges oc
      LEFT JOIN depgroup dg ON oc.DepGroupId = dg.DepGroupId
      LEFT JOIN billprinthead bph ON oc.BillPrintHeadId = bph.BillPrintHeadId
      ORDER BY oc.OtherCharges ASC
    `;
    res.json({ success: true, data: otherCharges });
  } catch (error) {
    console.error('Error fetching other charges:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dropdown data
router.get('/dropdown-data', async (req, res) => {
  try {
    const [depGroups, billPrintHeads] = await Promise.all([
      prisma.$queryRaw`SELECT DepGroupId, DepGroup FROM depgroup ORDER BY DepGroup`,
      prisma.$queryRaw`SELECT BillPrintHeadId, BillPrintHead FROM billprinthead ORDER BY Slno`
    ]);
    
    res.json({ 
      success: true, 
      data: { depGroups, billPrintHeads } 
    });
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new other charge
router.post('/', async (req, res) => {
  try {
    const {
      OtherCharges, DepGroupId, Rate, Unit, ServiceCh, ShowInFinal,
      BillPrintHeadId, ConcYN, QtyReq, Code, CSTP, SGST, vatp,
      ICU, CAB, SUIT, IPYN, corporateyn
    } = req.body;
    
    await prisma.$executeRaw`
      INSERT INTO othercharges (
        OtherCharges, DepGroupId, Rate, Unit, ServiceCh, ShowInFinal,
        BillPrintHeadId, ConcYN, QtyReq, Code, CSTP, SGST, vatp,
        ICU, CAB, SUIT, IPYN, corporateyn
      ) VALUES (
        ${OtherCharges}, ${DepGroupId || null}, ${Rate || 0}, ${Unit || null}, 
        ${ServiceCh || 'N'}, ${ShowInFinal || 'Y'}, ${BillPrintHeadId || null}, 
        ${ConcYN || 'N'}, ${QtyReq || 'N'}, ${Code || null}, ${CSTP || 0}, 
        ${SGST || 0}, ${vatp || 0}, ${ICU || 0}, ${CAB || 0}, ${SUIT || 0}, 
        ${IPYN || 'Y'}, ${corporateyn || 'N'}
      )
    `;
    
    res.json({ success: true, message: 'Other charge created successfully' });
  } catch (error) {
    console.error('Error creating other charge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update other charge
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      OtherCharges, DepGroupId, Rate, Unit, ServiceCh, ShowInFinal,
      BillPrintHeadId, ConcYN, QtyReq, Code, CSTP, SGST, vatp,
      ICU, CAB, SUIT, IPYN, corporateyn
    } = req.body;
    
    await prisma.$executeRaw`
      UPDATE othercharges SET
        OtherCharges = ${OtherCharges}, DepGroupId = ${DepGroupId || null},
        Rate = ${Rate || 0}, Unit = ${Unit || null}, ServiceCh = ${ServiceCh || 'N'},
        ShowInFinal = ${ShowInFinal || 'Y'}, BillPrintHeadId = ${BillPrintHeadId || null},
        ConcYN = ${ConcYN || 'N'}, QtyReq = ${QtyReq || 'N'}, Code = ${Code || null},
        CSTP = ${CSTP || 0}, SGST = ${SGST || 0}, vatp = ${vatp || 0},
        ICU = ${ICU || 0}, CAB = ${CAB || 0}, SUIT = ${SUIT || 0},
        IPYN = ${IPYN || 'Y'}, corporateyn = ${corporateyn || 'N'}
      WHERE OtherChargesId = ${parseInt(id)}
    `;
    
    res.json({ success: true, message: 'Other charge updated successfully' });
  } catch (error) {
    console.error('Error updating other charge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete other charge
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM othercharges WHERE OtherChargesId = ${parseInt(id)}`;
    res.json({ success: true, message: 'Other charge deleted successfully' });
  } catch (error) {
    console.error('Error deleting other charge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
