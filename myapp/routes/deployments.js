// server/routes/deployments.js  
const express = require('express');  
const pool = require('../models/database'); // 引入数据库连接  
const router = express.Router();  

// 获取所有部署数据  
router.get('/', async (req, res) => {  
  try {  
    const [deployments] = await pool.query('SELECT * FROM deployments ORDER BY timestamp DESC');  
    res.json(deployments);  
  } catch (error) {  
    console.error('获取部署数据时出错:', error);  
    res.status(500).json({ message: '无法加载部署数据' });  
  }  
});  

// 触发新的部署（模拟），并保存数据到数据库  
router.post('/api/deployments/trigger', async (req, res) => {  
  const { project_name } = req.body; // 从请求体中获取项目名称  

  if (!project_name) {  
    return res.status(400).json({ message: '项目名称是必需的' });  
  }  

  try {  
    const [result] = await pool.query(  
      'INSERT INTO deployments (project_name, status, progress, timestamp, log) VALUES (?, ?, ?, ?, ?)',  
      [project_name, 'in-progress', 0, new Date(), '开始新的部署']  
    );  

    const deploymentId = result.insertId; // 获取新插入记录的 ID  

    // 模拟部署进度更新  
    simulateDeploymentProgress(deploymentId);  

    res.json({ message: '新的部署已成功触发！', deploymentId });  
  } catch (error) {  
    console.error('触发部署时出错:', error);  
    res.status(500).json({ message: '触发新的部署时出错' });  
  }  
});  

// 模拟部署进度更新  
const simulateDeploymentProgress = async (deploymentId) => {  
  let progress = 0;  
  const interval = setInterval(async () => {  
    progress += 10; // 每次增加10%  
    let status = 'in-progress';  
    let log = `部署进度: ${progress}%`;  

    if (progress >= 100) {  
      progress = 100;  
      status = 'success';  
      log += '\n部署完成！';  
      clearInterval(interval);  
    }  

    // 更新数据库中的部署记录  
    await pool.query(  
      'UPDATE deployments SET progress = ?, status = ?, log = ? WHERE id = ?',  
      [progress, status, log, deploymentId]  
    );  
  }, 1000); // 每秒更新一次  
};  

// 更新部署状态  
router.put('/:id', async (req, res) => {  
  const { id } = req.params;  
  const { status, progress, log } = req.body;  

  try {  
    const [result] = await pool.query(  
      'UPDATE deployments SET status = ?, progress = ?, log = ? WHERE id = ?',  
      [status, progress, log, id]  
    );  

    if (result.affectedRows === 0) {  
      return res.status(404).json({ message: '未找到该部署' });  
    }  

    res.json({ message: '部署状态已更新' });  
  } catch (error) {  
    console.error('更新部署状态时出错:', error);  
    res.status(500).json({ message: '更新部署状态时出错' });  
  }  
});  

// 删除部署  
router.delete('/:id', async (req, res) => {  
  const { id } = req.params;  

  try {  
    const [result] = await pool.query('DELETE FROM deployments WHERE id = ?', [id]);  

    if (result.affectedRows === 0) {  
      return res.status(404).json({ message: '未找到该部署' });  
    }  

    res.json({ message: '部署已删除' });  
  } catch (error) {  
    console.error('删除部署时出错:', error);  
    res.status(500).json({ message: '删除部署时出错' });  
  }  
});  

module.exports = router;