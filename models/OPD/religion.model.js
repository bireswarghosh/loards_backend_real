import db from '../../config/db.js';

/**
 * Get all religions from the database
 * @returns {Promise<Array>} Array of religion objects
 */
export const getAllReligions = async () => {
  const [rows] = await db.query('SELECT * FROM religion');
  return rows;
};

// /**
//  * Get a religion by its ID
//  * @param {number} id - Religion ID
//  * @returns {Promise<Object|null>} Religion object or null if not found
//  */
// export const getReligionById = async (id) => {
//   const [rows] = await db.query('SELECT * FROM religion WHERE ReligionId = ?', [id]);
//   return rows[0] || null;
// };

// /**
//  * Create a new religion
//  * @param {string} religionName - Name of the religion
//  * @returns {Promise<number>} ID of the newly created religion
//  */
// export const createReligion = async (religionName) => {
//   const [result] = await db.query(
//     'INSERT INTO religion (Religion) VALUES (?)',
//     [religionName]
//   );
//   return result.insertId;
// };

// /**
//  * Update an existing religion
//  * @param {number} id - Religion ID to update
//  * @param {string} religionName - New religion name
//  * @returns {Promise<Object>} Result of the update operation
//  */
// export const updateReligion = async (id, religionName) => {
//   const [result] = await db.query(
//     'UPDATE religion SET Religion = ? WHERE ReligionId = ?',
//     [religionName, id]
//   );
//   return result;
// };

// /**
//  * Delete a religion by its ID
//  * @param {number} id - Religion ID to delete
//  * @returns {Promise<Object>} Result of the delete operation
//  */
// export const deleteReligion = async (id) => {
//   const [result] = await db.query('DELETE FROM religion WHERE ReligionId = ?', [id]);
//   return result;
// };