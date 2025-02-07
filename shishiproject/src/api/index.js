import axios from 'axios';  

const api = axios.create({  
  baseURL: 'http://localhost:5000/api', // 确保这里的 URL 正确  
});  

export default api;