import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lordop'
});

try {
  // Add auto increment to BedId
  await connection.execute('ALTER TABLE bedmaster MODIFY BedId int(11) NOT NULL AUTO_INCREMENT');
  console.log('✅ Added AUTO_INCREMENT to BedId');
  
  // Set starting auto increment value
  await connection.execute('ALTER TABLE bedmaster AUTO_INCREMENT = 1');
  console.log('✅ Set AUTO_INCREMENT starting value to 1');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await connection.end();
}