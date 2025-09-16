import prisma from '../../prisma/client.js';

export const admissionController = {
  // CREATE - Add new admission
  create: async (req, res) => {
    try {
      const data = req.body;
      
      const admission = await prisma.admition.create({
        data: {
          AdmitionId: data.AdmitionId,
          AdmitionNo: data.AdmitionNo,
          AdmitionDate: data.AdmitionDate ? new Date(data.AdmitionDate) : null,
          AdmitionTime: data.AdmitionTime,
          BillTime: data.BillTime,
          OPD: data.OPD,
          OPDId: data.OPDId,
          Booking: data.Booking,
          BookingId: data.BookingId,
          PatientName: data.PatientName,
          Add1: data.Add1,
          Add2: data.Add2,
          Add3: data.Add3,
          Age: data.Age,
          AgeType: data.AgeType,
          Sex: data.Sex,
          MStatus: data.MStatus,
          PhoneNo: data.PhoneNo,
          AreaId: data.AreaId,
          ReligionId: data.ReligionId,
          GurdianName: data.GurdianName,
          Relation: data.Relation,
          RelativeName: data.RelativeName,
          RelativePhoneNo: data.RelativePhoneNo,
          Company: data.Company,
          CompanyId: data.CompanyId,
          DepartmentId: data.DepartmentId,
          BedId: data.BedId,
          UCDoctor1Id: data.UCDoctor1Id,
          UCDoctor2Id: data.UCDoctor2Id,
          UCDoctor3Id: data.UCDoctor3Id,
          DiseaseId: data.DiseaseId,
          RMOId: data.RMOId,
          Referral: data.Referral,
          ReferralId: data.ReferralId,
          RefDoctorId: data.RefDoctorId,
          Package: data.Package,
          PackageId: data.PackageId,
          PackageAmount: data.PackageAmount,
          CashLess: data.CashLess,
          CashLessId: data.CashLessId,
          UserId: data.UserId,
          Status: data.Status,
          Discharge: data.Discharge,
          AdmitionNo1: data.AdmitionNo1,
          Rename: data.Rename,
          AdmType: data.AdmType,
          InsComp: data.InsComp,
          DayCareYN: data.DayCareYN,
          BedRate: data.BedRate,
          DayCareId: data.DayCareId,
          PatientId: data.PatientId,
          Remarks: data.Remarks,
          SpRemarks: data.SpRemarks,
          IdentNo: data.IdentNo,
          PolcNo: data.PolcNo,
          CCNNo: data.CCNNo,
          CardNo: data.CardNo,
          PPN: data.PPN,
          BillDone: data.BillDone,
          Occupation: data.Occupation,
          Passport: data.Passport,
          DietChartId: data.DietChartId,
          tpaper: data.tpaper,
          PanNo: data.PanNo,
          PackageCHK: data.PackageCHK,
          nameemployer: data.nameemployer,
          refdate: data.refdate ? new Date(data.refdate) : null,
          Nameemp: data.Nameemp,
          empcode: data.empcode,
          RefDoctorId2: data.RefDoctorId2,
          packagevalid: data.packagevalid ? new Date(data.packagevalid) : null,
          optdiagoinc: data.optdiagoinc,
          optmediinc: data.optmediinc,
          optotherchargeinc: data.optotherchargeinc,
          Weight: data.Weight,
          oprationdate: data.oprationdate ? new Date(data.oprationdate) : null,
          optime: data.optime,
          AgeD: data.AgeD,
          AgeTypeD: data.AgeTypeD,
          AgeN: data.AgeN,
          AgeTypeN: data.AgeTypeN,
          URN: data.URN,
          packagestart: data.packagestart ? new Date(data.packagestart) : null,
          AcGenLedCompany: data.AcGenLedCompany,
          optotinc: data.optotinc,
          MEXECUTIVE: data.MEXECUTIVE
        }
      });

      res.status(201).json({
        success: true,
        message: 'Admission created successfully',
        data: admission
      });
    } catch (error) {
      console.error('Error creating admission:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating admission',
        error: error.message
      });
    }
  },

  // READ - Get all admissions with pagination
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;

      const where = search ? {
        OR: [
          { PatientName: { contains: search, mode: 'insensitive' } },
          { PhoneNo: { contains: search, mode: 'insensitive' } },
          { AdmitionId: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const [admissions, total] = await Promise.all([
        prisma.admition.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { AdmitionDate: 'desc' },
            { AdmitionTime: 'desc' }
          ]
        }),
        prisma.admition.count({ where })
      ]);

      res.json({
        success: true,
        data: admissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching admissions:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching admissions',
        error: error.message
      });
    }
  },

  // READ - Get specific admission by ID
  getById: async (req, res) => {
    try {
      // Handle compound IDs like 000051/25-26 by decoding URL
      const id = decodeURIComponent(req.params.id);
      
      const admission = await prisma.admition.findUnique({
        where: { AdmitionId: id }
      });

      if (!admission) {
        return res.status(404).json({
          success: false,
          message: 'Admission not found'
        });
      }

      res.json({
        success: true,
        data: admission
      });
    } catch (error) {
      console.error('Error fetching admission:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching admission',
        error: error.message
      });
    }
  },

  // UPDATE - Update admission
  update: async (req, res) => {
    try {
      const id = decodeURIComponent(req.params.id);
      const data = req.body;

      const admission = await prisma.admition.update({
        where: { AdmitionId: id },
        data: {
          AdmitionNo: data.AdmitionNo,
          AdmitionDate: data.AdmitionDate ? new Date(data.AdmitionDate) : null,
          AdmitionTime: data.AdmitionTime,
          BillTime: data.BillTime,
          OPD: data.OPD,
          OPDId: data.OPDId,
          Booking: data.Booking,
          BookingId: data.BookingId,
          PatientName: data.PatientName,
          Add1: data.Add1,
          Add2: data.Add2,
          Add3: data.Add3,
          Age: data.Age,
          AgeType: data.AgeType,
          Sex: data.Sex,
          MStatus: data.MStatus,
          PhoneNo: data.PhoneNo,
          AreaId: data.AreaId,
          ReligionId: data.ReligionId,
          GurdianName: data.GurdianName,
          Relation: data.Relation,
          RelativeName: data.RelativeName,
          RelativePhoneNo: data.RelativePhoneNo,
          Company: data.Company,
          CompanyId: data.CompanyId,
          DepartmentId: data.DepartmentId,
          BedId: data.BedId,
          UCDoctor1Id: data.UCDoctor1Id,
          UCDoctor2Id: data.UCDoctor2Id,
          UCDoctor3Id: data.UCDoctor3Id,
          DiseaseId: data.DiseaseId,
          RMOId: data.RMOId,
          Referral: data.Referral,
          ReferralId: data.ReferralId,
          RefDoctorId: data.RefDoctorId,
          Package: data.Package,
          PackageId: data.PackageId,
          PackageAmount: data.PackageAmount,
          CashLess: data.CashLess,
          CashLessId: data.CashLessId,
          UserId: data.UserId,
          Status: data.Status,
          Discharge: data.Discharge,
          AdmitionNo1: data.AdmitionNo1,
          Rename: data.Rename,
          AdmType: data.AdmType,
          InsComp: data.InsComp,
          DayCareYN: data.DayCareYN,
          BedRate: data.BedRate,
          DayCareId: data.DayCareId,
          PatientId: data.PatientId,
          Remarks: data.Remarks,
          SpRemarks: data.SpRemarks,
          IdentNo: data.IdentNo,
          PolcNo: data.PolcNo,
          CCNNo: data.CCNNo,
          CardNo: data.CardNo,
          PPN: data.PPN,
          BillDone: data.BillDone,
          Occupation: data.Occupation,
          Passport: data.Passport,
          DietChartId: data.DietChartId,
          tpaper: data.tpaper,
          PanNo: data.PanNo,
          PackageCHK: data.PackageCHK,
          nameemployer: data.nameemployer,
          refdate: data.refdate ? new Date(data.refdate) : null,
          Nameemp: data.Nameemp,
          empcode: data.empcode,
          RefDoctorId2: data.RefDoctorId2,
          packagevalid: data.packagevalid ? new Date(data.packagevalid) : null,
          optdiagoinc: data.optdiagoinc,
          optmediinc: data.optmediinc,
          optotherchargeinc: data.optotherchargeinc,
          Weight: data.Weight,
          oprationdate: data.oprationdate ? new Date(data.oprationdate) : null,
          optime: data.optime,
          AgeD: data.AgeD,
          AgeTypeD: data.AgeTypeD,
          AgeN: data.AgeN,
          AgeTypeN: data.AgeTypeN,
          URN: data.URN,
          packagestart: data.packagestart ? new Date(data.packagestart) : null,
          AcGenLedCompany: data.AcGenLedCompany,
          optotinc: data.optotinc,
          MEXECUTIVE: data.MEXECUTIVE
        }
      });

      res.json({
        success: true,
        message: 'Admission updated successfully',
        data: admission
      });
    } catch (error) {
      console.error('Error updating admission:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating admission',
        error: error.message
      });
    }
  },

  // DELETE - Delete admission
  delete: async (req, res) => {
    try {
      const id = decodeURIComponent(req.params.id);
      
      await prisma.admition.delete({
        where: { AdmitionId: id }
      });

      res.json({
        success: true,
        message: 'Admission deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting admission:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting admission',
        error: error.message
      });
    }
  },

  // SEARCH - Search admissions
  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const admissions = await prisma.admition.findMany({
        where: {
          OR: [
            { PatientName: { contains: q, mode: 'insensitive' } },
            { PhoneNo: { contains: q, mode: 'insensitive' } },
            { AdmitionId: { contains: q, mode: 'insensitive' } },
            { AdmitionNo: { contains: q, mode: 'insensitive' } }
          ]
        },
        orderBy: { AdmitionDate: 'desc' },
        take: 100
      });

      res.json({
        success: true,
        data: admissions,
        count: admissions.length
      });
    } catch (error) {
      console.error('Error searching admissions:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching admissions',
        error: error.message
      });
    }
  },

  // FILTER - Filter by date range
  filterByDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const admissions = await prisma.admition.findMany({
        where: {
          AdmitionDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        orderBy: [
          { AdmitionDate: 'desc' },
          { AdmitionTime: 'desc' }
        ]
      });

      res.json({
        success: true,
        data: admissions,
        count: admissions.length
      });
    } catch (error) {
      console.error('Error filtering admissions:', error);
      res.status(500).json({
        success: false,
        message: 'Error filtering admissions',
        error: error.message
      });
    }
  }
};