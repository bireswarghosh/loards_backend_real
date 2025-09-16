





// backend/models/OPD/admission.model.js
import db from '../../config/db.js';
import { generateAdmissionId } from '../../utils/idGenerator.js';

export const createAdmission = async (admissionData) => {
  try {
    // Generate admission ID
    const admissionId = await generateAdmissionId(new Date(admissionData.AdmitionDate));
    
    // Generate AdmitionNo with 'A-' prefix
    const admissionNo = `A-${admissionId}`;
    
    // Set default values for all fields
    const dataWithDefaults = {
      // Required fields
      AdmitionDate: admissionData.AdmitionDate,
      PatientName: admissionData.PatientName,
      
      // Auto-generated IDs
      AdmitionId: admissionId,
      AdmitionNo: admissionNo,
      AdmitionNo1: admissionNo,
      
      // Optional fields with defaults
      AdmitionTime: admissionData.AdmitionTime || null,
      BillTime: admissionData.BillTime || null,
      OPD: admissionData.OPD || 'Y',
      OPDId: admissionData.OPDId || null,
      Booking: admissionData.Booking || 'N',
      BookingId: admissionData.BookingId || null,
      Add1: admissionData.Add1 || null,
      Add2: admissionData.Add2 || null,
      Add3: admissionData.Add3 || null,
      Age: admissionData.Age || null,
      AgeType: admissionData.AgeType || null,
      Sex: admissionData.Sex || null,
      MStatus: admissionData.MStatus || null,
      PhoneNo: admissionData.PhoneNo || null,
      AreaId: admissionData.AreaId || null,
      ReligionId: admissionData.ReligionId || null,
      GurdianName: admissionData.GurdianName || null,
      Relation: admissionData.Relation || null,
      RelativeName: admissionData.RelativeName || null,
      RelativePhoneNo: admissionData.RelativePhoneNo || null,
      Company: admissionData.Company || 'N',
      CompanyId: admissionData.CompanyId || 0,
      DepartmentId: admissionData.DepartmentId || null,
      BedId: admissionData.BedId || null,
      UCDoctor1Id: admissionData.UCDoctor1Id || null,
      UCDoctor2Id: admissionData.UCDoctor2Id || null,
      UCDoctor3Id: admissionData.UCDoctor3Id || null,
      DiseaseId: admissionData.DiseaseId || null,
      RMOId: admissionData.RMOId || null,
      Referral: admissionData.Referral || 'N',
      ReferralId: admissionData.ReferralId || 0,
      RefDoctorId: admissionData.RefDoctorId || null,
      Package: admissionData.Package || 'N',
      PackageId: admissionData.PackageId || 0,
      PackageAmount: admissionData.PackageAmount || 0,
      CashLess: admissionData.CashLess || 'N',
      CashLessId: admissionData.CashLessId || 0,
      UserId: admissionData.UserId || 42,
      Status: admissionData.Status || 'O',
      Discharge: admissionData.Discharge || 'N',
      Rename: admissionData.Rename || null,
      AdmType: admissionData.AdmType || 0,
      InsComp: admissionData.InsComp || null,
      DayCareYN: admissionData.DayCareYN || 'N',
      BedRate: admissionData.BedRate || 0,
      DayCareId: admissionData.DayCareId || 0,
      PatientId: admissionData.PatientId || null,
      Remarks: admissionData.Remarks || null,
      SpRemarks: admissionData.SpRemarks || null,
      IdentNo: admissionData.IdentNo || null,
      PolcNo: admissionData.PolcNo || null,
      CCNNo: admissionData.CCNNo || null,
      CardNo: admissionData.CardNo || null,
      PPN: admissionData.PPN || 0,
      BillDone: admissionData.BillDone || null,
      Occupation: admissionData.Occupation || null,
      Passport: admissionData.Passport || null,
      DietChartId: admissionData.DietChartId || null,
      tpaper: admissionData.tpaper || null,
      PanNo: admissionData.PanNo || null,
      PackageCHK: admissionData.PackageCHK || 0,
      nameemployer: admissionData.nameemployer || null,
      refdate: admissionData.refdate || new Date(),
      Nameemp: admissionData.Nameemp || null,
      empcode: admissionData.empcode || null,
      RefDoctorId2: admissionData.RefDoctorId2 || null,
      packagevalid: admissionData.packagevalid || '2000-01-01 00:00:00',
      optdiagoinc: admissionData.optdiagoinc || 0,
      optmediinc: admissionData.optmediinc || 0,
      optotherchargeinc: admissionData.optotherchargeinc || 0,
      Weight: admissionData.Weight || '0.000',
      oprationdate: admissionData.oprationdate || null,
      optime: admissionData.optime || null,
      AgeD: admissionData.AgeD || 0,
      AgeTypeD: admissionData.AgeTypeD || 'M',
      AgeN: admissionData.AgeN || 0,
      AgeTypeN: admissionData.AgeTypeN || 'D',
      URN: admissionData.URN || '.',
      packagestart: admissionData.packagestart || '2000-01-01 00:00:00',
      AcGenLedCompany: admissionData.AcGenLedCompany || 0,
      optotinc: admissionData.optotinc || 0,
      MEXECUTIVE: admissionData.MEXECUTIVE || 0
    };
    
    // Insert into database
    const [result] = await db.query(
      'INSERT INTO admition SET ?',
      [dataWithDefaults]
    );
    
    return {
      insertId: result.insertId,
      admissionId: admissionId,
      admissionNo: admissionNo
    };
  } catch (error) {
    console.error('Error in createAdmission:', error);
    throw error;
  }
};

export const getAllAdmissions = async () => {
  const [rows] = await db.query('SELECT * FROM admition ORDER BY AdmitionDate DESC LIMIT 100');
  return rows;
};

export const getAdmissionById = async (id) => {
  const [rows] = await db.query('SELECT * FROM admition WHERE AdmitionId = ?', [id]);
  return rows[0];
};

// export const updateAdmission = async (id, admissionData) => {
//   // Remove ID fields from update data
//   const { AdmitionId, AdmitionNo, AdmitionNo1, ...updateData } = admissionData;
  
//   const [result] = await db.query(
//     'UPDATE admition SET ? WHERE AdmitionId = ?',
//     [updateData, id]
//   );
  
//   return result;
// };

// In models/OPD/admission.model.js
export const updateAdmission = async (id, admissionData) => {
  try {
    // Remove ID fields from update data to prevent them from being updated
    const { 
      AdmitionId, 
      AdmitionNo, 
      AdmitionNo1,
      ...updateData 
    } = admissionData;
    
    // Execute update query
    const [result] = await db.query(
      'UPDATE admition SET ? WHERE AdmitionId = ?',
      [updateData, id]
    );
    
    return result;
  } catch (error) {
    console.error('Error in updateAdmission:', error);
    throw error;
  }
};








export const deleteAdmission = async (id) => {
  const [result] = await db.query('DELETE FROM admition WHERE AdmitionId = ?', [id]);
  return result;
};

// Search admissions by date range
export const searchAdmissionsByDateRange = async (startDate, endDate) => {
  const [rows] = await db.query(
    'SELECT * FROM admition WHERE AdmitionDate BETWEEN ? AND ? ORDER BY AdmitionDate DESC',
    [startDate, endDate]
  );
  return rows;
};

// Search admissions by patient name and   phone number  if both  match  then  show me data  
// Search admissions by patient name and phone number
export const searchAdmissionsByNameAndPhone = async (name, phone) => {
  const [rows] = await db.query(
    'SELECT * FROM admition WHERE PatientName LIKE ? AND PhoneNo LIKE ? ORDER BY AdmitionDate DESC',
    [`%${name}%`, `%${phone}%`]
  );
  return rows;
};

// Search admissions by phone number only
export const searchAdmissionsByPhone = async (phone) => {
  const [rows] = await db.query(
    'SELECT * FROM admition WHERE PhoneNo = ? ORDER BY AdmitionDate DESC',
    [phone]
  );
  return rows;
};
