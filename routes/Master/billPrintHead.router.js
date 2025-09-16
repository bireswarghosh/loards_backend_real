import express from 'express';
import prisma from '../../prisma/client.js';

const router = express.Router();

// Get all bill print heads
router.get('/', async (req, res) => {
  try {
    const billPrintHeads = await prisma.$queryRaw`
      SELECT * FROM billprinthead ORDER BY Slno ASC
    `;
    res.json({ success: true, data: billPrintHeads });
  } catch (error) {
    console.error('Error fetching bill print heads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new bill print head
router.post('/', async (req, res) => {
  try {
    const { BillPrintHead, Slno } = req.body;
    
    await prisma.$executeRaw`
      INSERT INTO billprinthead (BillPrintHead, Slno)
      VALUES (${BillPrintHead}, ${Slno})
    `;
    
    res.json({ success: true, message: 'Bill print head created successfully' });
  } catch (error) {
    console.error('Error creating bill print head:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update bill print head
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { BillPrintHead, Slno } = req.body;
    
    await prisma.$executeRaw`
      UPDATE billprinthead 
      SET BillPrintHead = ${BillPrintHead}, Slno = ${Slno}
      WHERE BillPrintHeadId = ${parseInt(id)}
    `;
    
    res.json({ success: true, message: 'Bill print head updated successfully' });
  } catch (error) {
    console.error('Error updating bill print head:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete bill print head
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.$executeRaw`
      DELETE FROM billprinthead WHERE BillPrintHeadId = ${parseInt(id)}
    `;
    
    res.json({ success: true, message: 'Bill print head deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill print head:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;