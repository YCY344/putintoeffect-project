<template>  
    <div class="home">  
      <h1>欢迎来到 SQL 工具箱</h1>  
      <p>  
        这是一个用于生成 SQL 语句和执行工具的应用。请从下方选择一个功能。  
      </p>  
      <div class="navigation">  
        <router-link to="/sql">SQL 生成器</router-link>  
        <router-link to="/port">端口检测</router-link>  
        <router-link to="/deployment">部署看板</router-link>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  export default {  
    name: 'Home',  
  }  
  </script>  
  
  <style scoped>  
  .home {  
    display: flex;  
    flex-direction: column;  
    align-items: center;  
    justify-content: center;  
    height: 100vh;  
    text-align: center;  
  }  
  
  .navigation {  
    margin-top: 20px;  
  }  
  
  .navigation a {  
    margin: 0 10px;  
    text-decoration: none;  
    color: #42b983;  
    font-weight: bold;  
  }  
  
  .navigation a:hover {  
    text-decoration: underline;  
  }  
  </style>