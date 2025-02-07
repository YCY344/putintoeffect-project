// routes/port.js  
const express = require('express');  
const net = require('net');  
const router = express.Router();  

// 存储历史记录  
let history = [];  

// 端口检测接口  
router.post('/check', (req, res) => {  
  const { host, port } = req.body;  

  const client = new net.Socket();  
  client.setTimeout(2000); // 设置连接超时时间为2秒  

  client.on('connect', () => {  
    client.destroy(); // 连接成功后关闭连接  
    const status = 'open';  
    history.unshift({ host, port, status, time: new Date() }); // 记录历史  
    res.json({ status });  
  });  

  client.on('timeout', () => {  
    client.destroy();  
    const status = 'timeout';  
    history.unshift({ host, port, status, time: new Date() });  
    res.json({ status });  
  });  

  client.on('error', (err) => {  
    client.destroy();  
    const status = err.code === 'ECONNREFUSED' ? 'closed' : 'timeout';  
    history.unshift({ host, port, status, time: new Date() });  
    res.json({ status });  
  });  

  client.connect(port, host); // 连接到指定的主机和端口  
});  

// 获取检测历史记录的接口  
router.get('/history', (req, res) => {  
  res.json(history);  
});  

// 清除历史记录的接口  
router.delete('/history', (req, res) => {  
  history = []; // 清空历史记录  
  res.json({ message: '历史记录已清除' });  
});  

module.exports = router;