import db from '../../config/db.js';

export const getAllZones = async () => {
  const [rows] = await db.query('SELECT * FROM zone');
  return rows;
};

export const getZoneById = async (id) => {
  const [rows] = await db.query('SELECT * FROM zone WHERE ZoneId = ?', [id]);
  return rows[0];
};

export const createZone = async (zone_name) => {
  const [result] = await db.query(
    'INSERT INTO zone (Zone) VALUES (?)',
    [zone_name]
  );
  return result.insertId;
};

export const updateZone = async (id, zone_name) => {
  const [result] = await db.query(
    'UPDATE zone SET Zone = ? WHERE ZoneId = ?',
    [zone_name, id]
  );
  return result;
};

export const deleteZone = async (id) => {
  const [result] = await db.query('DELETE FROM zone WHERE ZoneId = ?', [id]);
  return result;
};