// backend/utils/idGenerator.js
import db from '../config/db.js';

/**
 * Generates an admission ID in the format: 000656/24-25
 * - First part is a sequential number padded with zeros
 * - Second part is the financial year (April to March)
 * @param {Date} admissionDate - The date of admission
 * @returns {Promise<string>} - The generated admission ID
 */
export const generateAdmissionId = async (admissionDate) => {
  // Get current financial year
  const date = admissionDate || new Date();
  let startYear, endYear;
  
  // Financial year is from April to March
  if (date.getMonth() >= 3) { // April (3) onwards
    startYear = date.getFullYear();
    endYear = date.getFullYear() + 1;
  } else { // January to March
    startYear = date.getFullYear() - 1;
    endYear = date.getFullYear();
  }
  
  // Format as YY-YY (e.g., 24-25)
  const financialYear = `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
  
  // Get the last admission ID for this financial year
  const [rows] = await db.query(
    'SELECT AdmitionId FROM admition WHERE AdmitionId LIKE ? ORDER BY AdmitionId DESC LIMIT 1',
    [`%/${financialYear}`]
  );
  
  let nextNumber = 1;
  
  if (rows.length > 0) {
    // Extract the numeric part before the slash
    const lastId = rows[0].AdmitionId;
    const lastNumber = parseInt(lastId.split('/')[0], 10);
    nextNumber = lastNumber + 1;
  }
  
  // Pad with zeros to 6 digits
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  
  // Combine to create the final ID
  return `${paddedNumber}/${financialYear}`;
};
