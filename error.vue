<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { BRAND_MARK_PATHS } from '~/utils/brand-mark';

const props = defineProps<{ error?: { statusCode?: number } }>();
const status = computed(() => props.error?.statusCode || 404);
setResponseStatus(status.value);
usePageSeo(() => ({
  title: status.value === 404 ? '页面未找到' : '页面暂时无法访问',
  description: status.value === 404 ? '请求的页面不存在，请返回首页继续浏览。' : '页面暂时无法访问，请稍后重试。',
  noindex: true,
}));

let returnTimer: ReturnType<typeof setTimeout> | undefined;

function returnHome() {
  clearTimeout(returnTimer);
  return clearError({ redirect: '/' });
}

onMounted(() => {
  if (status.value === 404) returnTimer = setTimeout(returnHome, 3000);
});
onBeforeUnmount(() => clearTimeout(returnTimer));
</script>

<template>
  <main class="error-page">
    <template v-if="status === 404">
      <a class="error-logo" href="/" aria-label="返回首页" @click.prevent="returnHome">
        <svg viewBox="0 0 377 377" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path v-for="(path, index) in BRAND_MARK_PATHS" :key="index" :d="path" fill="currentColor" />
        </svg>
      </a>
      <p class="screen-reader-only" role="status">页面未找到，3 秒后返回首页。</p>
    </template>
    <div v-else class="error-message">
      <h1>页面暂时无法访问</h1>
      <p>{{ status }}</p>
      <a href="/" @click.prevent="returnHome">返回首页</a>
    </div>
  </main>
</template>

<style scoped>
.error-page {
  --error-bg: #fff;
  --error-ink: #222;
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  padding: 24px;
  background: var(--error-bg);
  color: var(--error-ink);
}
.error-logo {
  display: block;
  width: clamp(160px, 26vmin, 260px);
  aspect-ratio: 1;
  color: #38e7cd;
}
.error-logo svg { display: block; width: 100%; height: 100%; }
.error-logo:focus-visible { outline: 2px solid currentColor; outline-offset: 16px; }
.error-message { text-align: center; }
.error-message a { color: inherit; }
.screen-reader-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (prefers-color-scheme: dark) {
  .error-page { --error-bg: #000; --error-ink: #ddd; }
}
.dark-mode .error-page { --error-bg: #000; --error-ink: #ddd; }
.light-mode .error-page { --error-bg: #fff; --error-ink: #222; }
</style>
