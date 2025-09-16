import prisma from '../../prisma/client.js';

// GET parameters
export const getParameters = async (req, res) => {
  try {
    const parameters = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
    const data = parameters[0] || null;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get parameters error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE parameters
export const updateParameters = async (req, res) => {
  try {
    const data = req.body;
    
    // Check if record exists
    const existing = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
    
    if (existing.length > 0) {
      // Update existing record
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      
      const updateQuery = `UPDATE paramiterindoor SET ${fields}`;
      await prisma.$executeRawUnsafe(updateQuery, ...values);
      const updated = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
      
      res.json({ success: true, data: updated[0], message: 'Parameters updated successfully' });
    } else {
      // Create new record
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const insertQuery = `INSERT INTO paramiterindoor (${fields}) VALUES (${placeholders})`;
      await prisma.$executeRawUnsafe(insertQuery, ...values);
      const created = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
      
      res.json({ success: true, data: created[0], message: 'Parameters created successfully' });
    }
  } catch (error) {
    console.error('Update parameters error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET specific parameter
export const getParameter = async (req, res) => {
  try {
    const { field } = req.params;
    const rows = await prisma.$queryRawUnsafe(`SELECT ${field} FROM paramiterindoor LIMIT 1`);
    
    if (rows.length > 0) {
      res.json({ success: true, data: { [field]: rows[0][field] } });
    } else {
      res.status(404).json({ success: false, message: `Parameter '${field}' not found` });
    }
  } catch (error) {
    console.error('Get parameter error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE specific parameter
export const updateParameter = async (req, res) => {
  try {
    const { field } = req.params;
    const { value } = req.body;
    
    const existing = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
    
    if (existing.length > 0) {
      await prisma.$executeRawUnsafe(`UPDATE paramiterindoor SET ${field} = ?`, value);
      const updated = await prisma.$queryRaw`SELECT * FROM paramiterindoor LIMIT 1`;
      
      res.json({ success: true, data: updated[0], message: `Parameter ${field} updated successfully` });
    } else {
      res.status(404).json({ success: false, message: 'Parameters not found' });
    }
  } catch (error) {
    console.error('Update parameter error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};