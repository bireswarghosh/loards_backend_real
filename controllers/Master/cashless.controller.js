import prisma from '../../prisma/client.js';

export const getCashless = async (req, res) => {
  try {
    const cashless = await prisma.$queryRaw`
      SELECT 
        c.CashlessId,
        c.Cashless,
        c.Add1,
        c.Add2,
        c.Phone,
        c.Company,
        c.Add3,
        c.emailid,
        c.contactperson,
        c.cPhone,
        c.servicecharge,
        c.AcGenLedCompany,
        agl.\`Desc\` as AcGenLedDesc,
        asg.SubGrp,
        ag.ACGroup,
        ah.ACHead
      FROM cashless c
      LEFT JOIN acgenled agl ON c.AcGenLedCompany = agl.DescId
      LEFT JOIN acsubgrp asg ON agl.AcSubGrpId = asg.AcSubGrpId
      LEFT JOIN acgroup ag ON asg.AcGroupId = ag.ACGroupId
      LEFT JOIN achead ah ON ag.ACHeadId = ah.ACHeadId
      ORDER BY c.CashlessId ASC
    `;
    res.json({ success: true, data: cashless });
  } catch (error) {
    console.error('Error in getCashless:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCashlessById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRaw`
      SELECT 
        c.*,
        agl.\`Desc\` as AcGenLedDesc,
        asg.SubGrp,
        ag.ACGroup,
        ah.ACHead
      FROM cashless c
      LEFT JOIN acgenled agl ON c.AcGenLedCompany = agl.DescId
      LEFT JOIN acsubgrp asg ON agl.AcSubGrpId = asg.AcSubGrpId
      LEFT JOIN acgroup ag ON asg.AcGroupId = ag.ACGroupId
      LEFT JOIN achead ah ON ag.ACHeadId = ah.ACHeadId
      WHERE c.CashlessId = ${parseInt(id)}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'Cashless not found' });
    }
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCashless = async (req, res) => {
  try {
    const { Cashless, Add1, Add2, Phone, Company, Add3, emailid, contactperson, cPhone, servicecharge, AcGenLedCompany } = req.body;
    const result = await prisma.$queryRaw`SELECT MAX(CashlessId) as maxId FROM cashless`;
    const maxId = result[0].maxId;
    const nextId = maxId ? maxId + 1 : 1;
    
    await prisma.$executeRaw`
      INSERT INTO cashless (CashlessId, Cashless, Add1, Add2, Phone, Company, Add3, emailid, contactperson, cPhone, servicecharge, AcGenLedCompany) 
      VALUES (${nextId}, ${Cashless}, ${Add1}, ${Add2}, ${Phone}, ${Company}, ${Add3}, ${emailid}, ${contactperson}, ${cPhone}, ${servicecharge}, ${AcGenLedCompany})
    `;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        CashlessId: nextId, 
        Cashless, Add1, Add2, Phone, Company, Add3, emailid, contactperson, cPhone, servicecharge, AcGenLedCompany
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCashless = async (req, res) => {
  try {
    const { id } = req.params;
    const { Cashless, Add1, Add2, Phone, Company, Add3, emailid, contactperson, cPhone, servicecharge, AcGenLedCompany } = req.body;
    
    await prisma.$executeRaw`
      UPDATE cashless 
      SET Cashless = ${Cashless}, Add1 = ${Add1}, Add2 = ${Add2}, Phone = ${Phone}, Company = ${Company}, 
          Add3 = ${Add3}, emailid = ${emailid}, contactperson = ${contactperson}, cPhone = ${cPhone}, 
          servicecharge = ${servicecharge}, AcGenLedCompany = ${AcGenLedCompany}
      WHERE CashlessId = ${parseInt(id)}
    `;
    
    const result = await prisma.$queryRaw`
      SELECT c.*, agl.\`Desc\` as AcGenLedDesc
      FROM cashless c
      LEFT JOIN acgenled agl ON c.AcGenLedCompany = agl.DescId
      WHERE c.CashlessId = ${parseInt(id)}
    `;
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCashless = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRaw`DELETE FROM cashless WHERE CashlessId = ${parseInt(id)}`;
    res.json({ success: true, message: 'Cashless deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper endpoints for dropdowns
export const getAcGenLeds = async (req, res) => {
  try {
    const acGenLeds = await prisma.$queryRaw`SELECT DescId, \`Desc\` FROM acgenled ORDER BY \`Desc\` ASC`;
    res.json({ success: true, data: acGenLeds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};