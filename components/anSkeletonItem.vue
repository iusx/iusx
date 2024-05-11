<template>
    <div class="ql-skeleton-item" :style="{width: width, height: height}"></div>
  </template>
  
  <script setup>
  import {defineProps} from 'vue';
  defineProps(["variant", "width", "height"]);
  </script>
  
  <style scoped>
  @keyframes loading {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .ql-skeleton-item {
    background-color: #f2f2f2;
    animation: loading 1.5s infinite;
  }
  </style>