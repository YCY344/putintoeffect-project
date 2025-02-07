<template>  
  <div class="sql-generator">  
    <h2>SQL语句生成器</h2>  

    <div class="form-section">  
      <input v-model="tableName" placeholder="表名称">  

      <div class="operation-group">  
        <label for="operation">选择操作：</label>  
        <select v-model="selectedOperation">  
          <option value="select">选择</option>  
          <option value="insert">插入</option>  
          <option value="update">更新</option>  
          <option value="delete">删除</option>  
        </select>  
      </div>  

      <div class="field-group">  
        <label>选择字段：</label>  
        <div v-for="(field, index) in fields" :key="index" class="field-item">  
          <input v-model="fields[index]">  
          <button @click="removeField(index)">×</button>  
        </div>  
        <button @click="addField">添加字段</button>  
      </div>  

      <div class="condition-group" v-if="selectedOperation !== 'insert'">  
        <label>筛选条件：</label>  
        <div v-for="(condition, index) in conditions" :key="index" class="condition-item">  
          <input v-model="conditions[index]">  
          <button @click="removeCondition(index)">×</button>  
        </div>  
        <button @click="addCondition">添加条件</button>  
      </div>  

      <button @click="generateSQL">生成SQL</button>  
    </div>  

    <div v-if="generatedSQL" class="result-section">  
      <h3>生成的SQL语句：</h3>  
      <pre>{{ generatedSQL }}</pre>  
    </div>  

    <div class="history-section">  
      <h3>生成历史</h3>  
      <ul>  
        <li v-for="item in history" :key="item.id">  
          {{ item.table_name }} - {{ item.sql_statement }} - {{ new Date(item.created_at).toLocaleString() }}  
        </li>  
      </ul>  
    </div>  
  </div>  
</template>

<script setup>  
import { ref, onMounted } from 'vue';  
import api from '../api';  

const tableName = ref('');  
const fields = ref(['']);  
const conditions = ref(['']);  
const generatedSQL = ref('');  
const history = ref([]);  
const selectedOperation = ref('select'); // 默认选择"选择操作"  

const addField = () => fields.value.push('');  
const removeField = (index) => fields.value.splice(index, 1);  
const addCondition = () => conditions.value.push('');  
const removeCondition = (index) => conditions.value.splice(index, 1);  

const generateSQL = async () => {  
  try {  
    const response = await api.post('/sql/generate', {  
      tableName: tableName.value,  
      fields: fields.value.filter(f => f.trim()),  
      conditions: conditions.value.filter(c => c.trim()),  
      operation: selectedOperation.value // 发送操作类型  
    });  
    
    generatedSQL.value = response.data.sql;  
    loadHistory();  
  } catch (error) {  
    console.error('生成失败:', error);  
  }  
};  

const loadHistory = async () => {  
  try {  
    const response = await api.get('/sql/history');  
    history.value = response.data;  
  } catch (error) {  
    console.error('获取历史失败:', error);  
  }  
};  

onMounted(loadHistory);  
</script>

<style scoped>  
.sql-generator {  
  max-width: 600px; /* 限制最大宽度 */  
  margin: auto; /* 居中 */  
  padding: 20px; /* 内边距 */  
  background-color: #fff; /* 背景颜色 */  
  border-radius: 8px; /* 圆角 */  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
}  

h2 {  
  text-align: center; /* 标题居中 */  
  color: #333; /* 深色 */  
}  

.form-section {  
  padding: 20px;  
  border: 1px solid #e2e2e2;  
  border-radius: 8px;  
  background-color: #f9f9f9; /* 背景颜色 */  
}  

.operation-group {  
  display: flex;  
  justify-content: space-between;  
  align-items: center;  
  margin-bottom: 15px;  
}  

.operation-group label {  
  margin-right: 10px; /* 标签和选项之间的间距 */  
}  

select, input {  
  padding: 8px; /* 内边距 */  
  border: 1px solid #ccc; /* 边框 */  
  border-radius: 4px; /* 圆角 */  
  width: 100%; /* 100% 宽度 */  
  box-sizing: border-box; /* 包含边框和内边距 */  
}  

.field-group, .condition-group {  
  margin: 15px 0;  
}  

.field-item, .condition-item {  
  display: flex;  
  gap: 10px;  
  margin: 5px 0;  
}  

.button {  
  background-color: #007bff; /* 蓝色背景 */  
  color: white; /* 白色文字 */  
  padding: 10px; /* 内边距 */  
  border: none; /* 无边框 */  
  border-radius: 4px; /* 圆角 */  
  cursor: pointer; /* 鼠标指针样式 */  
  transition: background-color 0.3s; /* 背景色过渡效果 */  
}  

.button:hover {  
  background-color: #0056b3; /* 鼠标悬停颜色 */  
}  

.result-section {  
  margin-top: 20px;  
}  

.result-section pre {  
  background: #f0f0f0; /* 浅灰色背景 */  
  padding: 15px;  
  border-radius: 6px;  
  overflow-x: auto; /* 超出部分可横向滚动 */  
}  

.history-section {  
  margin-top: 20px;  
}  

.history-section h3 {  
  margin-bottom: 10px; /* 歷史记录标题底部空间 */  
}  

.history-section ul {  
  list-style: none;  
  padding: 0;  
}  

.history-section li {  
  padding: 10px;  
  background-color: #f7f7f7; /* 浅灰背景 */  
  border: 1px solid #edeef0; /* 边框 */  
  border-radius: 4px; /* 圆角 */  
  margin-bottom: 10px; /* 项目之间的间距 */  
}  

.history-section li:hover {  
  background-color: #eaeaea; /* 鼠标悬停背景 */  
}  

@media (max-width: 600px) {  
  .sql-generator {  
    padding: 15px; /* 移动设备内填充 */  
  }  

  .operation-group {  
    flex-direction: column; /* 在小屏幕上垂直排列 */  
  }  

  .operation-group label {  
    margin-bottom: 5px; /* 标签底部间隙 */  
  }  

  select, input {  
    width: auto; /* 自动宽度 */  
  }  
}  
</style>