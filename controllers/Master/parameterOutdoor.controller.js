import prisma from '../../prisma/client.js';

// GET outdoor parameters
export const getOutdoorParameters = async (req, res) => {
  try {
    const parameters = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
    const result = parameters.length > 0 ? parameters[0] : null;
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE outdoor parameters
export const updateOutdoorParameters = async (req, res) => {
  try {
    const data = req.body;
    
    // Check if record exists
    const existing = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
    
    if (existing.length > 0) {
      // Update existing record
      await prisma.$executeRaw`
        UPDATE paramiteroutdoor SET 
          RegCh = ${data.RegCh || 0},
          RegValid = ${data.RegValid || 365},
          ValidType = ${data.ValidType || 'M'},
          Registration = ${data.Registration || 'Y'},
          MRDosYN = ${data.MRDosYN || 'N'},
          SrvChYN = ${data.SrvChYN || 'Y'},
          DocChYN = ${data.DocChYN || 'Y'},
          SvcChYN = ${data.SvcChYN || 'Y'},
          UserYN = ${data.UserYN || 'Y'},
          AsstYN = ${data.AsstYN || 'N'},
          adminyn = ${data.adminyn || 'N'},
          backdateentryyn = ${data.backdateentryyn || 'N'},
          cregno = ${data.cregno || 'Y'}
      `;
      
      const updated = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
      res.json({ success: true, data: updated[0] });
    } else {
      // Create new record
      await prisma.$executeRaw`
        INSERT INTO paramiteroutdoor (
          RegCh, RegValid, ValidType, Registration, MRDosYN, SrvChYN, 
          DocChYN, SvcChYN, UserYN, AsstYN, adminyn, backdateentryyn, cregno
        ) VALUES (
          ${data.RegCh || 0}, ${data.RegValid || 365}, ${data.ValidType || 'M'},
          ${data.Registration || 'Y'}, ${data.MRDosYN || 'N'}, ${data.SrvChYN || 'Y'},
          ${data.DocChYN || 'Y'}, ${data.SvcChYN || 'Y'}, ${data.UserYN || 'Y'},
          ${data.AsstYN || 'N'}, ${data.adminyn || 'N'}, ${data.backdateentryyn || 'N'},
          ${data.cregno || 'Y'}
        )
      `;
      
      const created = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
      res.json({ success: true, data: created[0] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET specific outdoor parameter
export const getOutdoorParameter = async (req, res) => {
  try {
    const { field } = req.params;
    const parameters = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
    
    if (parameters.length > 0 && parameters[0][field] !== undefined) {
      res.json({ success: true, data: { [field]: parameters[0][field] } });
    } else {
      res.status(404).json({ success: false, message: 'Parameter not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE specific outdoor parameter
export const updateOutdoorParameter = async (req, res) => {
  try {
    const { field } = req.params;
    const { value } = req.body;
    
    const existing = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
    
    if (existing.length > 0) {
      // Use a safer approach for dynamic field updates
      const query = `UPDATE paramiteroutdoor SET ${field} = ?`;
      await prisma.$executeRawUnsafe(query, value);
      const updated = await prisma.$queryRaw`SELECT * FROM paramiteroutdoor LIMIT 1`;
      res.json({ success: true, data: updated[0] });
    } else {
      res.status(404).json({ success: false, message: 'Parameters not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};