// backend/controllers/OPD/patient-with-bills.controller.js
import prisma from '../../prisma/client.js';

// GET PATIENT WITH ALL BILLS - Get patient registration with all outdoor bills
export const getPatientWithBillsController = async (req, res) => {
  try {
    const { registrationId } = req.params.registrationId ? req.params : req.query;
    
    // Use Prisma's include to get patient with all related bills in one query
    const patientWithBills = await prisma.patientregistration.findUnique({
      where: { RegistrationId: registrationId },
      include: {
        outdoorbills: {
          orderBy: { OutBillDate: 'desc' }  // Order bills by latest first
        }
      }
    });
    
    if (!patientWithBills) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        patient: {
          RegistrationId: patientWithBills.RegistrationId,
          PatientName: patientWithBills.PatientName,
          PhoneNo: patientWithBills.PhoneNo,
          Age: patientWithBills.Age,
          Sex: patientWithBills.Sex,
          Add1: patientWithBills.Add1,
          GurdianName: patientWithBills.GurdianName,
          Weight: patientWithBills.Weight,
          Height: patientWithBills.Height,
          BloodGroup: patientWithBills.BloodGroup
        },
        bills: patientWithBills.outdoorbills,
        totalBills: patientWithBills.outdoorbills.length,
        totalAmount: patientWithBills.outdoorbills.reduce((sum, bill) => sum + (bill.GTotal || 0), 0),
        totalPaid: patientWithBills.outdoorbills.reduce((sum, bill) => sum + (bill.paidamt || 0), 0),
        totalDue: patientWithBills.outdoorbills.reduce((sum, bill) => sum + (bill.dueamt || 0), 0)
      }
    });
  } catch (error) {
    console.error('Error fetching patient with bills:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// GET ALL PATIENTS WITH BILLS - Get all patients with their bill counts
export const getAllPatientsWithBillSummaryController = async (req, res) => {
  try {
    const { page = 1, limit = 1000, phone, date } = req.query;
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    let whereClause = {};
    if (phone) {
      whereClause.PhoneNo = { contains: phone };
    }
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      whereClause.RegistrationDate = {
        gte: searchDate,
        lt: nextDay
      };
    }
    
    // Optimized query - only essential fields
    const [patients, total] = await Promise.all([
      prisma.patientregistration.findMany({
        where: whereClause,
        skip: skip,
        take: parseInt(limit),
        select: {
          RegistrationId: true,
          PatientName: true,
          PhoneNo: true,
          Age: true,
          Sex: true,
          Add1: true,
          RegistrationDate: true,
          RegistrationTime: true,
          _count: {
            select: { outdoorbills: true }
          }
        },
        orderBy: { RegistrationDate: 'desc' }
      }),
      prisma.patientregistration.count({ where: whereClause })
    ]);
    
    // Simplified data transformation
    const patientsWithSummary = patients.map(patient => ({
      RegistrationId: patient.RegistrationId,
      PatientName: patient.PatientName,
      PhoneNo: patient.PhoneNo,
      Age: patient.Age,
      Sex: patient.Sex,
      Add1: patient.Add1,
      RegDate: patient.RegistrationDate,
      RegTime: patient.RegistrationTime,
      billCount: patient._count.outdoorbills
    }));
    
    res.status(200).json({
      success: true,
      count: patientsWithSummary.length,
      data: patientsWithSummary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching patients with bill summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// SEARCH PATIENTS BY PHONE WITH BILLS
export const searchPatientsByPhoneWithBillsController = async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Search patients by phone and include their bills
    const patients = await prisma.patientregistration.findMany({
      where: { PhoneNo: phone },
      include: {
        outdoorbills: {
          orderBy: { OutBillDate: 'desc' }
        }
      },
      orderBy: { RegistrationDate: 'desc' }
    });
    
    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No patients found with this phone number'
      });
    }
    
    // Transform data to include bill summary for each patient
    const patientsWithBills = patients.map(patient => ({
      patient: {
        RegistrationId: patient.RegistrationId,
        PatientName: patient.PatientName,
        PhoneNo: patient.PhoneNo,
        Age: patient.Age,
        Sex: patient.Sex,
        Add1: patient.Add1,
        GurdianName: patient.GurdianName
      },
      bills: patient.outdoorbills,
      billSummary: {
        totalBills: patient.outdoorbills.length,
        totalAmount: patient.outdoorbills.reduce((sum, bill) => sum + (bill.GTotal || 0), 0),
        totalPaid: patient.outdoorbills.reduce((sum, bill) => sum + (bill.paidamt || 0), 0),
        totalDue: patient.outdoorbills.reduce((sum, bill) => sum + (bill.dueamt || 0), 0)
      }
    }));
    
    res.status(200).json({
      success: true,
      count: patientsWithBills.length,
      data: patientsWithBills
    });
  } catch (error) {
    console.error('Error searching patients by phone with bills:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};