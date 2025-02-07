<!-- src/components/Modal.vue -->  
<template>  
    <transition name="fade">  
      <div class="modal-overlay" v-if="isVisible" @click.self="close">  
        <div class="modal-content">  
          <button class="close-btn" @click="close" v-if="showCloseBtn">✖</button>  
          <header><slot name="header">默认标题</slot></header>  
          <main><slot name="body">默认内容</slot></main>  
          <footer><slot name="footer"></slot></footer>  
        </div>  
      </div>  
    </transition>  
  </template>  
  
  <script setup>  
  import { defineEmits, ref, computed } from 'vue';  
  
  const emit = defineEmits();  
  const props = defineProps({  
    showCloseBtn: {  
      type: Boolean,  
      default: true,  
    },  
    isVisible: {  
      type: Boolean,  
      default: false,  
    }  
  });  
  
  const close = () => {  
    emit('close');  
  };  
  </script>  
  
  <style scoped>  
  .modal-overlay {  
    position: fixed;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  
    background: rgba(0, 0, 0, 0.5);  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    z-index: 999; /* 确保模态框在最上层 */  
  }  
  
  .modal-content {  
    background: white;  
    padding: 20px;  
    border-radius: 8px;  
    width: 400px; /* 自定义宽度 */  
    max-width: 100%;  
    position: relative;  
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */  
  }  
  
  .close-btn {  
    position: absolute;  
    top: 10px;  
    right: 10px;  
    border: none;  
    background: transparent;  
    font-size: 20px;  
    cursor: pointer;  
  }  
  
  /* 添加淡入淡出的效果 */  
  .fade-enter-active, .fade-leave-active {  
    transition: opacity 0.3s;  
  }  
  .fade-enter, .fade-leave-to /* .fade-leave-active 在退出时应用 */ {  
    opacity: 0;  
  }  
  </style>