<template>  
    <div :class="['deployment-dashboard', { 'dark-theme': isDarkTheme }]">  
      <h2>部署管理面板</h2>  
      
      <div class="actions">  
        <button @click="toggleDarkMode">{{ isDarkTheme ? '切换到亮色模式' : '切换到暗色模式' }}</button>  
        <button @click="triggerDeployment">手动触发部署</button>  
      </div>  
  
      <div v-if="isLoading" class="loading-indicator">  
        <span>加载中...</span>  
        <div class="spinner"></div>  
      </div>  
  
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>  
  
      <input v-model="searchTerm" placeholder="搜索部署..." class="search-input" />  
  
      <div class="deployment-list">  
        <div  
          v-for="item in filteredDeployments"  
          :key="item.id"  
          class="progress-item"  
          @click="selectDeployment(item)"  
        >  
          <div class="project-info">  
            <span>{{ item.project_name }}</span>  
            <span>{{ item.progress }}%</span>  
            <span :class="['label', item.status]">{{ item.status }}</span>  
          </div>  
          <div class="progress-bar">  
            <div   
              class="progress-fill"   
              :style="{ width: item.progress + '%' }"  
            ></div>  
          </div>  
        </div>  
      </div>  
  
      <modal v-if="selectedDeployment" @close="selectedDeployment = null">  
        <template #header>{{ selectedDeployment.project_name }} 部署详细信息</template>  
        <template #body>  
          <div>  
            <p><strong>部署时间：</strong>{{ selectedDeployment.timestamp }}</p>  
            <p><strong>状态：</strong>{{ selectedDeployment.status }}</p>  
            <p><strong>进度：</strong>{{ selectedDeployment.progress }}%</p>  
            <h4>日志输出</h4>  
            <pre>{{ selectedDeployment.log }}</pre>  
          </div>  
        </template>  
      </modal>  
    </div>  
  </template>  
  
  <script setup>  
  import { ref, onMounted, computed } from 'vue';  
  import axios from '../api';  
  import Modal from '../components/Modal.vue'; // 添加模态框组件  
  
  const deployments = ref([]);  
  const isLoading = ref(false);  
  const errorMessage = ref('');  
  const isDarkTheme = ref(false);  
  const searchTerm = ref('');  
  const selectedDeployment = ref(null);  
  
  // 切换主题  
  const toggleDarkMode = () => {  
    isDarkTheme.value = !isDarkTheme.value;  
  };  
  
  // 获取部署数据  
  const fetchDeployments = async () => {  
    isLoading.value = true;  
    errorMessage.value = '';  
    try {  
      const response = await axios.get('/api/deployments');  
      deployments.value = response.data;  
    } catch (error) {  
      console.error('Error fetching deployments:', error);  
      errorMessage.value = '无法加载部署数据，请稍后再试。';  
    } finally {  
      isLoading.value = false;  
    }  
  };  
  
  // 触发新的部署  
  const triggerDeployment = async () => {  
    try {  
      const response = await axios.post('/api/deployments/trigger');  
      alert(response.data.message || '部署已成功触发！');  
      fetchDeployments(); // 刷新数据  
    } catch (error) {  
      alert('触发部署失败！');  
    }  
  };  
  
  // 选择部署  
  const selectDeployment = (deployment) => {  
    selectedDeployment.value = deployment; // 打开模态框  
  };  
  
  // 计算搜索结果  
  const filteredDeployments = computed(() => {  
    if (!searchTerm.value) return deployments.value;  
    return deployments.value.filter(item =>   
      item.project_name.toLowerCase().includes(searchTerm.value.toLowerCase())  
    );  
  });  
  
  // 在组件挂载后获取数据  
  onMounted(fetchDeployments);  
  </script>  
  
  <style scoped>  
  .deployment-dashboard {  
    padding: 20px;  
    border: 1px solid #ddd;  
    border-radius: 8px;  
    background: #fff;  
    transition: background 0.3s;  
  }  
  
  .dark-theme {  
    background: #2c3e50;  
    color: #ecf0f1;  
  }  
  
  .actions {  
    margin-bottom: 20px;  
  }  
  
  .loading-indicator {  
    display: flex;  
    align-items: center;  
    margin-bottom: 1rem;  
  }  
  
  .spinner {  
    width: 16px;  
    height: 16px;  
    border: 2px solid #42b983;  
    border-top: 2px solid transparent;  
    border-radius: 50%;  
    animation: spin 0.8s linear infinite;  
    margin-left: 10px;  
  }  
  
  @keyframes spin {  
    0% { transform: rotate(0deg); }  
    100% { transform: rotate(360deg); }  
  }  
  
  .error-message {  
    color: red;  
    margin-bottom: 1rem;  
  }  
  
  .search-input {  
    margin-bottom: 1rem;  
    width: 100%;  
    padding: 10px;  
  }  
  
  .deployment-list {  
    max-height: 400px; /* 限制最大高度 */  
    overflow-y: auto; /* 滚动条 */  
  }  
  
  .progress-bar {  
    height: 20px;  
    background: #eee;  
    border-radius: 10px;  
    overflow: hidden;  
  }  
  
  .progress-fill {  
    height: 100%;  
    background: #42b983;  
    transition: width 0.3s ease;  
  }  
  
  .progress-item {  
    margin-bottom: 1rem;  
    cursor: pointer;  
    padding: 10px;  
    border-radius: 5px;  
    transition: background 0.2s;  
  }  
  
  .progress-item:hover {  
    background-color: #f7f7f7; /* Hover effect */  
  }  
  
  .project-info {  
    display: flex;  
    justify-content: space-between;  
    align-items: center;   /* Align items vertically */  
    margin-bottom: 0.5rem;  
  }  
  
  .label {  
    padding: 2px 6px;  
    border-radius: 4px;  
    font-size: 14px;  
  }  
  
  .label.success {  
    background-color: #4CAF50; /* Green */  
    color: white;  
  }  
  
  .label.failed {  
    background-color: #f44336; /* Red */  
    color: white;  
  }  
  
  .label.in-progress {  
    background-color: #ff9800; /* Orange */  
    color: white;  
  }  
  
  button {  
    margin-right: 10px; /* 添加间隔 */  
    padding: 10px;  
    border: none;  
    border-radius: 5px;  
    background-color: #007bff;  
    color: white;  
    cursor: pointer;  
    transition: background 0.3s;  
  }  
  
  button:hover {  
    background-color: #0056b3;  
  }  
  </style>