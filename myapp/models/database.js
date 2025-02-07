// models/database.js  
const mysql = require('mysql2/promise');  
require('dotenv').config();  

const pool = mysql.createPool({  
  host: process.env.DB_HOST || 'localhost',  // 默认localhost  
  port: process.env.DB_PORT || 3306,         // 默认3306端口  
  user: process.env.DB_USER || 'root',       // 默认用户  
  password: process.env.DB_PASSWORD || '123456', // 数据库密码  
  database: process.env.DB_NAME || 'toolbox', // 默认数据库名  
  waitForConnections: true,  
  connectionLimit: 10  
});  

module.exports = pool;