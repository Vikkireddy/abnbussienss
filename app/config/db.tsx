import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0valedge!',
  database: 'abn_db'
});

(async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log('database connected');
  } catch (error) {
    console.log('not connected', error);
  }
})();