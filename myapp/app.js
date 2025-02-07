// server.js  
const express = require('express');  
const cors = require('cors');  
const bodyParser = require('body-parser');  
const sqlRoutes = require('./routes/sql');  
const portRoutes = require('./routes/port');  
const deploymentsRoutes = require('./routes/deployments'); 
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 5000;  

// 中间件  
app.use(cors());  
app.use(bodyParser.json()); // 处理 JSON 请求体  

// 路由  
app.use('/api/sql', sqlRoutes);  
app.use('/api/port', portRoutes);  
app.use('/api/deployments', deploymentsRoutes);

// 启动服务器  
app.listen(PORT, () => {  
  console.log(`服务器正在运行，端口: ${PORT}`);  
});