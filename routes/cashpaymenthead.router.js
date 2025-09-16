import express from 'express';
import prisma from '../prisma/client.js';
const router = express.Router();

// Get all cash payment heads
router.get('/', async (req, res) => {
  try {
    const cashPaymentHeads = await prisma.cashpaymenthead.findMany();
    res.json(cashPaymentHeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cash payment head by ID
router.get('/:id', async (req, res) => {
  try {
    const cashPaymentHead = await prisma.cashpaymenthead.findUnique({
      where: { CashPaymentHeadId: parseInt(req.params.id) }
    });
    
    if (!cashPaymentHead) {
      return res.status(404).json({ error: 'Cash Payment Head not found' });
    }
    res.json(cashPaymentHead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create cash payment head
router.post('/', async (req, res) => {
  try {
    const { CashPaymentHead, doctorId, doctorY } = req.body;
    const cashPaymentHead = await prisma.cashpaymenthead.create({
      data: { CashPaymentHead, doctorId, doctorY }
    });
    res.status(201).json({ 
      ...cashPaymentHead,
      message: 'Cash Payment Head created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cash payment head
router.put('/:id', async (req, res) => {
  try {
    const { CashPaymentHead, doctorId, doctorY } = req.body;
    const cashPaymentHead = await prisma.cashpaymenthead.update({
      where: { CashPaymentHeadId: parseInt(req.params.id) },
      data: { CashPaymentHead, doctorId, doctorY }
    });
    res.json({ ...cashPaymentHead, message: 'Cash Payment Head updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cash Payment Head not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete cash payment head
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cashpaymenthead.delete({
      where: { CashPaymentHeadId: parseInt(req.params.id) }
    });
    res.json({ message: 'Cash Payment Head deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cash Payment Head not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;