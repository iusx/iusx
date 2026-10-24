<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ error?: { statusCode?: number } }>();
const status = computed(() => props.error?.statusCode || 404);
setResponseStatus(status.value);
usePageSeo(() => ({
  title: status.value === 404 ? '页面未找到' : '页面暂时无法访问',
  description: status.value === 404 ? '请求的页面不存在，请返回首页继续浏览。' : '页面暂时无法访问，请稍后重试。',
  noindex: true,
}));
</script>

<template>
  <main class="error-page">
    <h1>{{ status === 404 ? '页面未找到' : '页面暂时无法访问' }}</h1>
    <p>{{ status }}</p>
    <NuxtLink to="/">返回首页</NuxtLink>
  </main>
</template>

<style scoped>
.error-page { padding: 5rem 1.5rem; text-align: center; }
</style>
