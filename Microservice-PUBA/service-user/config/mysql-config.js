const mysql = require('mysql2');

const connect = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'user_service',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

connect.getConnection((err, conn) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('MySQL connected successfully!');
    conn.release();
  }
});

module.exports = connect;
