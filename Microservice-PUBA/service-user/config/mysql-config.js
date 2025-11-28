const mysql = require('mysql2');

const connect = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'user_service',
  user: 'root',
  password: '',
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
