import prisma from '../../prisma/client.js';

// Single API for Outdoor Patient Visit Entry - All Operations
export const outdoorVisitEntryHandler = async (req, res) => {
  try {
    console.log('Request received:', req.body);
    const { action } = req.body;
    
    switch (action) {
      case 'CREATE':
        return await createOutdoorVisit(req, res);
      case 'UPDATE':
        return await updateOutdoorVisit(req, res);
      case 'DELETE':
        return await deleteOutdoorVisit(req, res);
      case 'GET':
        return await getOutdoorVisit(req, res);
      case 'SEARCH':
        return await searchOutdoorVisit(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Outdoor Visit Entry Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// CREATE - Complete Outdoor Visit Entry
const createOutdoorVisit = async (req, res) => {
  try {
    console.log('Creating outdoor visit with data:', req.body);
    const { patientData, billData } = req.body;
  
  const result = await prisma.$transaction(async (tx) => {
    // Generate RegistrationId
    const lastPatient = await tx.patientregistration.findFirst({
      orderBy: { RegistrationDate: 'desc' }
    });
    
    let nextRegNumber = 1;
    if (lastPatient && lastPatient.RegistrationId) {
      const match = lastPatient.RegistrationId.match(/^(\d+)\//); 
      if (match) {
        nextRegNumber = parseInt(match[1]) + 1;
      }
    }
    
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const nextYearShort = (parseInt(currentYear) + 1).toString().padStart(2, '0');
    const registrationId = String(nextRegNumber).padStart(6, '0') + '/' + currentYear + '-' + nextYearShort;
    const registrationNo = 'S-' + registrationId;
    
    // Create Patient
    const patient = await tx.patientregistration.create({
      data: {
        PatientName: patientData.PatientName,
        PhoneNo: patientData.PhoneNo,
        Add1: patientData.Add1 || null,
        Add2: patientData.Add2 || null,
        Add3: patientData.Add3 || null,
        Age: patientData.Age ? parseFloat(patientData.Age) : null,
        Sex: patientData.Sex || null,
        MStatus: patientData.MStatus || null,
        GurdianName: patientData.GurdianName || null,
        ReligionId: patientData.ReligionId || null,
        Weight: patientData.Weight ? parseFloat(patientData.Weight) : null,
        Height: patientData.Height ? parseFloat(patientData.Height) : null,
        bpmin: patientData.bpmin || null,
        bpmax: patientData.bpmax || null,
        Dob: patientData.Dob || null,
        EMailId: patientData.EMailId || null,
        RegistrationId: registrationId,
        RegistrationNo: registrationNo,
        RegistrationDate: new Date(),
        RegistrationTime: new Date().toLocaleTimeString('en-US', { 
          hour12: true, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    });
    
    // Generate OutBillId if billData provided
    let bill = null;
    if (billData) {
      const lastBill = await tx.outdoorbillmst.findFirst({
        orderBy: { OutBillDate: 'desc' }
      });
      
      let nextBillNumber = 1;
      if (lastBill && lastBill.OutBillId) {
        const lastBillNumber = parseInt(lastBill.OutBillId);
        if (!isNaN(lastBillNumber)) {
          nextBillNumber = lastBillNumber + 1;
        }
      }
      
      const outBillId = String(nextBillNumber).padStart(4, '0');
      const outBillNo = 'OPDO/' + outBillId;
      
      bill = await tx.outdoorbillmst.create({
        data: {
          OutBillId: outBillId,
          OutBillNo: outBillNo,
          RegistrationId: registrationId,
          OutBillDate: new Date(),
          Amount: billData.BillAmt || 0,
          DoctorId: billData.UCDoctor1Id,
          department: billData.DepartmentId,
          narration: billData.narration,
          RegCh: billData.regnCh || 0,
          ProfCh: billData.proffCh || 0,
          ServiceCh: billData.svrCh || 0,
          Patient_Discount: billData.pDisc || 0,
          Professional_Discount: billData.proffDisc || 0,
          Service_Discount: billData.srvChDisc || 0
        }
      });
    }
    
    return { patient, bill };
  });
  
  console.log('Visit created successfully:', result);
  res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create outdoor visit error:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// UPDATE - Update Outdoor Visit
const updateOutdoorVisit = async (req, res) => {
  const { RegistrationId, patientData, billData } = req.body;
  
  const result = await prisma.$transaction(async (tx) => {
    // Update Patient
    const patient = await tx.patientregistration.update({
      where: { RegistrationId },
      data: patientData
    });
    
    // Update Bill
    let bill = null;
    if (billData && billData.OutBillId) {
      bill = await tx.outdoorbillmst.update({
        where: { OutBillId: billData.OutBillId },
        data: billData
      });
    }
    
    return { patient, bill };
  });
  
  res.json({ success: true, data: result });
};

// DELETE - Delete Outdoor Visit
const deleteOutdoorVisit = async (req, res) => {
  const { RegistrationId, OutBillId } = req.body;
  
  const result = await prisma.$transaction(async (tx) => {
    if (OutBillId) {
      // Delete specific bill
      await tx.outdoorbillmst.delete({
        where: { OutBillId }
      });
    } else if (RegistrationId) {
      // Delete all bills and patient
      await tx.outdoorbillmst.deleteMany({
        where: { RegistrationId }
      });
      await tx.patientregistration.delete({
        where: { RegistrationId }
      });
    }
    
    return { deleted: true };
  });
  
  res.json({ success: true, data: result });
};

// GET - Get Outdoor Visit Data
const getOutdoorVisit = async (req, res) => {
  const { RegistrationId } = req.body;
  
  if (!RegistrationId) {
    return res.status(400).json({ error: 'RegistrationId is required' });
  }
  
  const data = await prisma.patientregistration.findUnique({
    where: { RegistrationId },
    include: {
      outdoorbills: {
        orderBy: { OutBillDate: 'desc' }
      }
    }
  });
  
  if (!data) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  res.json({ success: true, data });
};

// SEARCH - Search Outdoor Visits
const searchOutdoorVisit = async (req, res) => {
  const { phone, patientName, dateFrom, dateTo } = req.body;
  
  let whereClause = {};
  
  if (phone) {
    whereClause.PhoneNo = { contains: phone };
  }
  if (patientName) {
    whereClause.PatientName = { contains: patientName };
  }
  if (dateFrom && dateTo) {
    whereClause.RegistrationDate = {
      gte: new Date(dateFrom),
      lte: new Date(dateTo)
    };
  }
  
  const data = await prisma.patientregistration.findMany({
    where: whereClause,
    include: {
      outdoorbills: true
    },
    orderBy: { RegistrationDate: 'desc' },
    take: 50
  });
  
  res.json({ success: true, data });
};

// REST API Functions for easier testing
export const getOutdoorVisitById = async (req, res) => {
  try {
    const { regNum, year } = req.params;
    const id = `${regNum}/${year}`;
    
    const data = await prisma.patientregistration.findUnique({
      where: { RegistrationId: id },
      include: {
        outdoorbills: {
          orderBy: { OutBillDate: 'desc' }
        }
      }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get outdoor visit error:', error);
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
};

export const updateOutdoorVisitById = async (req, res) => {
  try {
    const { regNum, year } = req.params;
    const id = `${regNum}/${year}`;
    const { patientData, billData } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      // Update Patient
      const patient = await tx.patientregistration.update({
        where: { RegistrationId: id },
        data: {
          PatientName: patientData?.PatientName,
          PhoneNo: patientData?.PhoneNo,
          Add1: patientData?.Add1,
          Add2: patientData?.Add2,
          Add3: patientData?.Add3,
          Age: patientData?.Age ? parseFloat(patientData.Age) : undefined,
          Sex: patientData?.Sex,
          MStatus: patientData?.MStatus,
          GurdianName: patientData?.GurdianName,
          ReligionId: patientData?.ReligionId,
          Weight: patientData?.Weight ? parseFloat(patientData.Weight) : undefined,
          Height: patientData?.Height ? parseFloat(patientData.Height) : undefined,
          bpmin: patientData?.bpmin ? parseFloat(patientData.bpmin) : undefined,
          bpmax: patientData?.bpmax ? parseFloat(patientData.bpmax) : undefined,
          Dob: patientData?.Dob ? new Date(patientData.Dob) : undefined,
          EMailId: patientData?.EMailId,
          BloodGroup: patientData?.BloodGroup
        }
      });
      
      // Update Bills if provided
      let bills = [];
      if (billData && Array.isArray(billData)) {
        for (const bill of billData) {
          if (bill.OutBillId) {
            const updatedBill = await tx.outdoorbillmst.update({
              where: { OutBillId: bill.OutBillId },
              data: {
                Amount: bill.BillAmt ? parseFloat(bill.BillAmt) : undefined,
                DoctorId: bill.UCDoctor1Id,
                department: bill.DepartmentId,
                narration: bill.narration,
                RegCh: bill.regnCh ? parseFloat(bill.regnCh) : undefined,
                ProfCh: bill.proffCh ? parseFloat(bill.proffCh) : undefined,
                ServiceCh: bill.svrCh ? parseFloat(bill.svrCh) : undefined,
                Patient_Discount: bill.pDisc ? parseFloat(bill.pDisc) : undefined,
                Professional_Discount: bill.proffDisc ? parseFloat(bill.proffDisc) : undefined,
                Service_Discount: bill.srvChDisc ? parseFloat(bill.srvChDisc) : undefined
              }
            });
            bills.push(updatedBill);
          }
        }
      }
      
      return { patient, bills };
    });
    
    res.json({ success: true, data: result, message: 'Outdoor visit updated successfully' });
  } catch (error) {
    console.error('Update outdoor visit error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
};

export const deleteOutdoorVisitById = async (req, res) => {
  try {
    const { regNum, year } = req.params;
    const id = `${regNum}/${year}`;
    
    const result = await prisma.$transaction(async (tx) => {
      // Delete all bills first
      await tx.outdoorbillmst.deleteMany({
        where: { RegistrationId: id }
      });
      
      // Delete patient
      const deletedPatient = await tx.patientregistration.delete({
        where: { RegistrationId: id }
      });
      
      return { deletedPatient };
    });
    
    res.json({ success: true, data: result, message: 'Outdoor visit deleted successfully' });
  } catch (error) {
    console.error('Delete outdoor visit error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
};