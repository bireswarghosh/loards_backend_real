import db from '../config/db.js';

export const findUserByUsername = async (username) => {
  const [rows] = await db.query(
    'SELECT UserId, UserName, Password, Admin FROM authentication WHERE UserName = ? AND Active = "Y"',
    [username]
  );
  return rows[0] || null;
};