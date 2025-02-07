// routes/sql.js  
const express = require('express');  
const pool = require('../models/database');  
const router = express.Router();  

// 生成 SQL 接口  
router.post('/generate', async (req, res) => {  
  const { tableName, fields, conditions, operation } = req.body; // 新增操作类型  

  // 确保接收到有效的输入  
  if (!tableName || fields.length === 0) {  
    return res.status(400).send({ error: '表名和字段必须提供' });  
  }  

  let sql;  

  // 根据操作类型生成不同的 SQL 语句  
  switch (operation) {  
    case 'select':  
      sql = `SELECT ${fields.join(', ')} FROM ${tableName}`;  
      if (conditions.length > 0) {  
        const whereClause = conditions.map(cond => `(${cond})`).join(' AND ');  
        sql += ` WHERE ${whereClause}`;  
      }  
      break;  

    case 'insert':  
      const values = fields.map(field => `?`).join(', '); // 生成占位符  
      sql = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values})`;  
      break;  

    case 'update':  
      const setClause = fields.map(field => `${field} = ?`).join(', '); // 生成 SET 子句  
      sql = `UPDATE ${tableName} SET ${setClause}`;  
      if (conditions.length > 0) {  
        const whereClause = conditions.map(cond => `(${cond})`).join(' AND ');  
        sql += ` WHERE ${whereClause}`;  
      }  
      break;  

    case 'delete':  
      sql = `DELETE FROM ${tableName}`;  
      if (conditions.length > 0) {  
        const whereClause = conditions.map(cond => `(${cond})`).join(' AND ');  
        sql += ` WHERE ${whereClause}`;  
      }  
      break;  

    default:  
      return res.status(400).send({ error: '不支持的操作类型' });  
  }  

 
  try {  
    // 保存生成的 SQL 语句到数据库  
    const query = 'INSERT INTO sql_history (table_name, sql_statement) VALUES (?, ?)';  
    await pool.query(query, [tableName, sql]); // 将 table_name 和 sql 保存到相应的列中  

    res.send({ sql });  
  } catch (error) {  
    console.error('数据库错误:', error);  
    res.status(500).send({ error: '保存历史记录失败' });  
  }  
});  

// 获取生成历史的接口  
router.get('/history', async (req, res) => {  
  try {  
    const [rows] = await pool.query('SELECT * FROM sql_history ORDER BY created_at DESC');  
    res.send(rows);  
  } catch (error) {  
    console.error('获取历史失败:', error);  
    res.status(500).send({ error: '获取历史记录失败' });  
  }  
});  

module.exports = router;