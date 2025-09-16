import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lordop'
});

try {
  const [rows] = await connection.execute('DESCRIBE bedmaster');
  console.log('BedMaster table structure:');
  console.table(rows);
  
  const [autoIncrement] = await connection.execute(`
    SELECT AUTO_INCREMENT 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'lordop' 
    AND TABLE_NAME = 'bedmaster'
  `);
  console.log('Auto increment value:', autoIncrement[0]?.AUTO_INCREMENT);
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}