import express from 'express';
import { moneyReceiptController } from '../../controllers/OPD/moneyreceipt.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// GET all money receipts
router.get('/moneyreceipt', authMiddleware, moneyReceiptController.getAll);

// SEARCH money receipts with filters
router.get('/moneyreceipt/search', authMiddleware, moneyReceiptController.search);

// GET money receipt by ID (supports compound IDs like 002735/24-25)
router.get('/moneyreceipt/:id(*)', authMiddleware, moneyReceiptController.getById);

// GET money receipts by admission ID (supports compound IDs like 002735/24-25)
router.get('/moneyreceipt/admission/:admissionId(*)', authMiddleware, moneyReceiptController.getByAdmissionId);

// CREATE new money receipt
router.post('/moneyreceipt', authMiddleware, moneyReceiptController.create);

// UPDATE money receipt
router.put('/moneyreceipt/:id(*)', authMiddleware, moneyReceiptController.update);

// DELETE money receipt
router.delete('/moneyreceipt/:id(*)', authMiddleware, moneyReceiptController.delete);

export default router;