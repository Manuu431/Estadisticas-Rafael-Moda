const mysql = require('mysql2/promise');
const { madridUtcOffset } = require('../utils/timezone');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
  maxIdle: 2,
  idleTimeout: 30000,
  enableKeepAlive: true,
  queueLimit: 0,
  ssl: process.env.DB_CA ? { ca: process.env.DB_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true } : undefined
});

pool.pool.on('connection', (connection) => connection.query('SET time_zone = ?', [madridUtcOffset()]));

module.exports = pool;