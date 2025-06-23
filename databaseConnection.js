require('dotenv').config(); // تحميل متغيرات البيئة من ملف .env
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// لتحويل الوعود (Promises) بدلاً من الـ Callbacks
const promisePool = pool.promise();

module.exports = promisePool;
