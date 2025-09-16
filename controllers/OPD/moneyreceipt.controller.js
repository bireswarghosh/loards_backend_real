import prisma from '../../prisma/client.js';

export const moneyReceiptController = {
  // GET all money receipts with admission details
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const [receipts, total] = await Promise.all([
        prisma.indoormoneyreecipt.findMany({
          skip,
          take: limit,
          orderBy: { ReceiptDate: 'desc' }
        }),
        prisma.indoormoneyreecipt.count()
      ]);
      
      // Manually fetch admission details for each receipt
      const receiptsWithAdmission = await Promise.all(
        receipts.map(async (receipt) => {
          if (receipt.RefferenceId) {
            const admission = await prisma.admition.findUnique({
              where: { AdmitionId: receipt.RefferenceId },
              select: {
                AdmitionId: true,
                AdmitionNo: true,
                PatientName: true,
                PhoneNo: true,
                Age: true,
                Sex: true,
                MStatus: true,
                Add1: true,
                Add2: true,
                Add3: true,
                GurdianName: true,
                ReligionId: true,
                AreaId: true
              }
            });
            return { ...receipt, admission };
          }
          return receipt;
        })
      );

      res.json({
        success: true,
        data: receiptsWithAdmission,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching money receipts:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching money receipts',
        error: error.message
      });
    }
  },

  // GET money receipt by ID
  getById: async (req, res) => {
    try {
      const id = decodeURIComponent(req.params.id);
      
      const receipt = await prisma.indoormoneyreecipt.findUnique({
        where: { MoneyreeciptId: id }
      });
      
      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: 'Money receipt not found'
        });
      }
      
      // Manually fetch admission details
      let admission = null;
      if (receipt.RefferenceId) {
        admission = await prisma.admition.findUnique({
          where: { AdmitionId: receipt.RefferenceId },
          select: {
            AdmitionId: true,
            AdmitionNo: true,
            PatientName: true,
            PhoneNo: true,
            Age: true,
            Sex: true,
            MStatus: true,
            Add1: true,
            Add2: true,
            Add3: true,
            GurdianName: true,
            ReligionId: true,
            AreaId: true
          }
        });
      }

      res.json({
        success: true,
        data: { ...receipt, admission }
      });
    } catch (error) {
      console.error('Error fetching money receipt:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching money receipt',
        error: error.message
      });
    }
  },

  // GET money receipts by admission ID
  getByAdmissionId: async (req, res) => {
    try {
      const { admissionId } = req.params;
      const decodedId = decodeURIComponent(admissionId);
      
      const receipts = await prisma.indoormoneyreecipt.findMany({
        where: { RefferenceId: decodedId },
        orderBy: { ReceiptDate: 'desc' }
      });
      
      // Manually fetch admission details
      let admission = null;
      if (receipts.length > 0) {
        admission = await prisma.admition.findUnique({
          where: { AdmitionId: decodedId },
          select: {
            AdmitionId: true,
            AdmitionNo: true,
            PatientName: true,
            PhoneNo: true,
            Age: true,
            Sex: true,
            MStatus: true,
            Add1: true,
            Add2: true,
            Add3: true,
            GurdianName: true,
            ReligionId: true,
            AreaId: true
          }
        });
      }
      
      const receiptsWithAdmission = receipts.map(receipt => ({
        ...receipt,
        admission
      }));

      res.json({
        success: true,
        data: receiptsWithAdmission,
        count: receiptsWithAdmission.length
      });
    } catch (error) {
      console.error('Error fetching receipts by admission:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching receipts by admission',
        error: error.message
      });
    }
  },

  // SEARCH money receipts with filters
  search: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const { dateFrom, dateTo, allReceipt, refund, search } = req.query;
      
      let whereClause = {};
      
      // Date range filter
      if (dateFrom && dateTo) {
        whereClause.ReceiptDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo + 'T23:59:59.999Z')
        };
      }
      
      // Search filter
      if (search && search.trim()) {
        whereClause.OR = [
          { MoneyreeciptNo: { contains: search, mode: 'insensitive' } },
          { PaidBy: { contains: search, mode: 'insensitive' } },
          { RefferenceId: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const [receipts, total] = await Promise.all([
        prisma.indoormoneyreecipt.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { ReceiptDate: 'desc' }
        }),
        prisma.indoormoneyreecipt.count({ where: whereClause })
      ]);
      
      // Manually fetch admission details for each receipt
      const receiptsWithAdmission = await Promise.all(
        receipts.map(async (receipt) => {
          if (receipt.RefferenceId) {
            const admission = await prisma.admition.findUnique({
              where: { AdmitionId: receipt.RefferenceId },
              select: {
                AdmitionId: true,
                AdmitionNo: true,
                PatientName: true,
                PhoneNo: true,
                Age: true,
                Sex: true,
                MStatus: true,
                Add1: true,
                Add2: true,
                Add3: true,
                GurdianName: true,
                ReligionId: true,
                AreaId: true
              }
            });
            return { ...receipt, admission };
          }
          return receipt;
        })
      );

      res.json({
        success: true,
        data: receiptsWithAdmission,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error searching money receipts:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching money receipts',
        error: error.message
      });
    }
  },

  // CREATE new money receipt
  create: async (req, res) => {
    try {
      const data = req.body;
      
      const receipt = await prisma.indoormoneyreecipt.create({
        data: {
          MoneyreeciptId: data.MoneyreeciptId,
          MoneyreeciptNo: data.MoneyreeciptNo,
          RefferenceId: data.RefferenceId,
          ReceiptType: data.ReceiptType,
          ReceiptDate: data.ReceiptDate ? new Date(data.ReceiptDate) : null,
          PaymentType: data.PaymentType,
          Amount: data.Amount,
          Bank: data.Bank,
          Cheque: data.Cheque,
          ChqDate: data.ChqDate ? new Date(data.ChqDate) : null,
          Narration: data.Narration,
          UserId: data.UserId,
          SlipNo: data.SlipNo,
          ClearDate: data.ClearDate ? new Date(data.ClearDate) : null,
          TDS: data.TDS,
          PaidBy: data.PaidBy,
          Remarks: data.Remarks,
          ReceiptTime: data.ReceiptTime,
          PrintDate: data.PrintDate ? new Date(data.PrintDate) : null
        }
      });

      res.status(201).json({
        success: true,
        message: 'Money receipt created successfully',
        data: receipt
      });
    } catch (error) {
      console.error('Error creating money receipt:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating money receipt',
        error: error.message
      });
    }
  },

  // UPDATE money receipt
  update: async (req, res) => {
    try {
      const id = decodeURIComponent(req.params.id);
      const data = req.body;
      
      // Build update object with only provided fields
      const updateData = {};
      
      if (data.MoneyreeciptNo !== undefined) updateData.MoneyreeciptNo = data.MoneyreeciptNo;
      if (data.RefferenceId !== undefined) updateData.RefferenceId = data.RefferenceId;
      if (data.ReceiptType !== undefined) updateData.ReceiptType = data.ReceiptType;
      if (data.ReceiptDate !== undefined) updateData.ReceiptDate = data.ReceiptDate ? new Date(data.ReceiptDate) : null;
      if (data.PaymentType !== undefined) updateData.PaymentType = data.PaymentType;
      if (data.Amount !== undefined) updateData.Amount = parseFloat(data.Amount);
      if (data.Bank !== undefined) updateData.Bank = data.Bank;
      if (data.Cheque !== undefined) updateData.Cheque = data.Cheque;
      if (data.ChqDate !== undefined) updateData.ChqDate = data.ChqDate ? new Date(data.ChqDate) : null;
      if (data.Narration !== undefined) updateData.Narration = data.Narration;
      if (data.UserId !== undefined) updateData.UserId = data.UserId;
      if (data.SlipNo !== undefined) updateData.SlipNo = data.SlipNo;
      if (data.ClearDate !== undefined) updateData.ClearDate = data.ClearDate ? new Date(data.ClearDate) : null;
      if (data.TDS !== undefined) updateData.TDS = data.TDS;
      if (data.PaidBy !== undefined) updateData.PaidBy = data.PaidBy;
      if (data.Remarks !== undefined) updateData.Remarks = data.Remarks;
      if (data.ReceiptTime !== undefined) updateData.ReceiptTime = data.ReceiptTime;
      if (data.PrintDate !== undefined) updateData.PrintDate = data.PrintDate ? new Date(data.PrintDate) : null;
      
      const updatedReceipt = await prisma.indoormoneyreecipt.update({
        where: { MoneyreeciptId: id },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Money receipt updated successfully',
        data: updatedReceipt
      });
    } catch (error) {
      console.error('Error updating money receipt:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating money receipt',
        error: error.message
      });
    }
  },

  // DELETE money receipt
  delete: async (req, res) => {
    try {
      const id = decodeURIComponent(req.params.id);
      
      const deletedReceipt = await prisma.indoormoneyreecipt.delete({
        where: { MoneyreeciptId: id }
      });

      res.json({
        success: true,
        message: 'Money receipt deleted successfully',
        data: deletedReceipt
      });
    } catch (error) {
      console.error('Error deleting money receipt:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting money receipt',
        error: error.message
      });
    }
  }
};