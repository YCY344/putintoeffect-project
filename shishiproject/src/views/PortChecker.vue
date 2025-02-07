<template>  
  <div class="port-checker">  
    <h2>网络端口检测</h2>  
    
    <div class="input-group">  
      <input v-model="host" placeholder="主机地址（如：127.0.0.1）" />  
      <input v-model.number="port" placeholder="端口号" type="number" min="1" max="65535" />  
      <button @click="checkPort" :disabled="loading">  
        <span v-if="loading">检测中...</span>  
        <span v-else>检测</span>  
      </button>  
    </div>  

    <div v-if="result" class="result">  
      <div :class="['status', result.status]">  
        {{ statusText }}  
      </div>  
      <p>检测时间：{{ new Date().toLocaleString() }}</p>  
    </div>  

    <div class="history">  
      <h3>检测历史</h3>  
      <ul>  
        <li v-for="(item, index) in history" :key="index">  
          {{ item.host }}:{{ item.port }} - {{ item.status }} ({{ item.time.toLocaleString() }})  
        </li>  
      </ul>  
      <button @click="clearHistory">清除历史记录</button>  
    </div>  
  </div>  
</template>  

<script setup>  
import { ref, computed } from 'vue';  
import api from '../api';  

const host = ref('localhost');  
const port = ref('');  
const result = ref(null);  
const history = ref([]);  
const loading = ref(false);  

const statusText = computed(() => {  
  const map = {  
    open: '端口开放',  
    closed: '端口关闭',  
    timeout: '连接超时'  
  };  
  return map[result.value?.status] || '未知状态';  
});  

const checkPort = async () => {  
  if (!host.value || !port.value) {  
    alert('请填写主机地址和端口号');  
    return;  
  }  

  loading.value = true; // 开始加载  
  try {  
    const response = await api.post('/port/check', {  
      host: host.value,  
      port: port.value  
    });  
    
    result.value = response.data;  
    history.value.unshift({  
      host: host.value,  
      port: port.value,  
      status: response.data.status,  
      time: new Date()  
    });  
  } catch (error) {  
    console.error('检测失败:', error);  
  } finally {  
    loading.value = false; // 结束加载  
  }  
};  

const clearHistory = () => {  
  history.value = [];  
};  
</script>  

<style scoped>  
.input-group {  
  display: flex;  
  gap: 10px;  
  margin: 20px 0;  
}  

input {  
  padding: 8px;  
  border: 1px solid #ddd;  
  border-radius: 4px;  
  width: 100%; /* 让输入框填满 */  
}  

button {  
  padding: 8px 12px;  
  border: none;  
  border-radius: 4px;  
  background-color: #007bff;  
  color: white;  
  cursor: pointer;  
  transition: background-color 0.3s;  
}  

button:disabled {  
  background-color: #ccc; /* 禁用状态 */  
  cursor: not-allowed;  
}  

.result {  
  margin: 20px 0;  
  padding: 15px;  
  border-radius: 6px;  
}  

.status {  
  padding: 10px;  
  color: white;  
  border-radius: 4px;  
}  

.open { background: #4CAF50; }  
.closed { background: #f44336; }  
.timeout { background: #ff9800; }  

.history {  
  margin-top: 20px;  
}  

.history ul {  
  list-style: none;  
  padding-left: 0;  
}  

.history button {  
  margin-top: 10px;  
  padding: 8px 12px;  
  border: none;  
  border-radius: 4px;  
  background-color: #f44336; /* 红色 */  
  color: white;  
  cursor: pointer;  
}  
</style>