import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db'
};

// CREATE - Add new AC General Ledger
export const createAcGenLed = async (req, res) => {
  try {
    const { 
      Desc, ShortName, OpTYpe, OpBalance, AcType, Address1, Address2, Address3, 
      Phone, ItPaNo, CSTNo, LSTNo, TDS, System, IntId, PartyType, EMail, 
      AcSubGrpId, EntType, BillFormatId, VCode, SCode, IGST 
    } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      `INSERT INTO acgenled (Desc, ShortName, OpTYpe, OpBalance, AcType, Address1, Address2, Address3, 
       Phone, ItPaNo, CSTNo, LSTNo, TDS, System, IntId, PartyType, EMail, AcSubGrpId, EntType, 
       BillFormatId, VCode, SCode, IGST, LDATE) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [Desc, ShortName, OpTYpe, parseFloat(OpBalance) || 0, AcType, Address1, Address2, Address3,
       Phone, ItPaNo, CSTNo, LSTNo, parseFloat(TDS) || 0, System, IntId, PartyType, EMail,
       parseInt(AcSubGrpId), EntType, parseInt(BillFormatId) || null, VCode, SCode, parseInt(IGST) || 0]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'AC General Ledger created successfully',
      data: { DescId: result.insertId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating AC General Ledger',
      error: error.message
    });
  }
};

// READ - Get all AC General Ledgers with pagination and search
export const getAllAcGenLeds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const connection = await mysql.createConnection(dbConfig);
    
    let whereClause = '';
    let queryParams = [];
    
    if (search) {
      whereClause = 'WHERE g.Desc LIKE ? OR g.ShortName LIKE ? OR g.Phone LIKE ? OR g.EMail LIKE ? OR s.SubGrp LIKE ?';
      const searchParam = `%${search}%`;
      queryParams = [searchParam, searchParam, searchParam, searchParam, searchParam];
    }

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM acgenled g 
       LEFT JOIN acsubgrp s ON g.AcSubGrpId = s.AcSubGrpId 
       ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const [rows] = await connection.execute(
      `SELECT g.*, s.SubGrp, s.AcGroupId,
       JSON_OBJECT('AcSubGrpId', s.AcSubGrpId, 'SubGrp', s.SubGrp) as acSubGrp
       FROM acgenled g 
       LEFT JOIN acsubgrp s ON g.AcSubGrpId = s.AcSubGrpId 
       ${whereClause}
       ORDER BY g.DescId DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    await connection.end();

    res.status(200).json({
      success: true,
      message: 'AC General Ledgers list',
      data: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC General Ledgers list',
      error: error.message
    });
  }
};

// READ - Get AC Sub Groups for dropdown
export const getAcSubGroupsForDropdown = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT AcSubGrpId, SubGrp FROM acsubgrp ORDER BY SubGrp ASC'
    );

    await connection.end();

    res.status(200).json({
      success: true,
      message: 'AC Sub Groups for dropdown',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC Sub Groups',
      error: error.message
    });
  }
};

// READ - Get AC General Ledger by ID
export const getAcGenLedById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      `SELECT g.*, s.SubGrp,
       JSON_OBJECT('AcSubGrpId', s.AcSubGrpId, 'SubGrp', s.SubGrp) as acSubGrp
       FROM acgenled g 
       LEFT JOIN acsubgrp s ON g.AcSubGrpId = s.AcSubGrpId 
       WHERE g.DescId = ?`,
      [parseInt(id)]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'AC General Ledger not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'AC General Ledger details',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AC General Ledger details',
      error: error.message
    });
  }
};

// UPDATE - Update AC General Ledger
export const updateAcGenLed = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      Desc, ShortName, OpTYpe, OpBalance, AcType, Address1, Address2, Address3, 
      Phone, ItPaNo, CSTNo, LSTNo, TDS, System, IntId, PartyType, EMail, 
      AcSubGrpId, EntType, BillFormatId, VCode, SCode, IGST 
    } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      `UPDATE acgenled SET Desc=?, ShortName=?, OpTYpe=?, OpBalance=?, AcType=?, Address1=?, Address2=?, Address3=?, 
       Phone=?, ItPaNo=?, CSTNo=?, LSTNo=?, TDS=?, System=?, IntId=?, PartyType=?, EMail=?, AcSubGrpId=?, EntType=?, 
       BillFormatId=?, VCode=?, SCode=?, IGST=? WHERE DescId=?`,
      [Desc, ShortName, OpTYpe, parseFloat(OpBalance) || 0, AcType, Address1, Address2, Address3,
       Phone, ItPaNo, CSTNo, LSTNo, parseFloat(TDS) || 0, System, IntId, PartyType, EMail,
       parseInt(AcSubGrpId), EntType, parseInt(BillFormatId) || null, VCode, SCode, parseInt(IGST) || 0, parseInt(id)]
    );

    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'AC General Ledger not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'AC General Ledger updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating AC General Ledger',
      error: error.message
    });
  }
};

// DELETE - Delete AC General Ledger
export const deleteAcGenLed = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'DELETE FROM acgenled WHERE DescId = ?',
      [parseInt(id)]
    );

    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'AC General Ledger not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'AC General Ledger deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting AC General Ledger',
      error: error.message
    });
  }
};