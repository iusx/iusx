<script setup>
import { defineProps } from "vue";

defineProps(["title", "info", "time", "client", "img", "types"]);
</script>
<template>
  <article class="layout page-content">
    <header class="content">
      <page-title :title="title" :time="time" :client="client" />
      <page-image v-if="img" :img="img" :info="info" :type="types" />
    </header>
    <div class="text-layout">
      <div class="text markdown-content">
        <slot></slot>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.text-layout {
  width: 100%;
  min-width: 0;
  padding-top: 1.5rem;

  .text {
    width: 100%;
    padding: 0;
    color: var(--article-text, #4a4a4a);
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.85;
    text-transform: none;
    text-align: left;
    overflow-wrap: anywhere;
    :deep(> :first-child) { margin-top: 0; }
  }
}

.layout {
  width: min(960px, 90%);
  margin: 2.5rem auto 5rem;
  padding: clamp(1.5rem, 4vw, 3rem);
  box-sizing: border-box;
  border: 1px solid var(--article-border, #d4d4d4);
  background: var(--article-bg, #fff);
  font-family: var(--article-font, monospace);
}

.content {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--article-border, #d4d4d4);
}

.dark-mode .layout { background: var(--article-bg, #000); }
.dark-mode .text-layout .text { color: var(--article-text, #b3b3b3); }

@media (max-width: 640px) {
  .layout { width: 92%; margin-top: 1.25rem; padding: 1rem; }
  .text-layout .text { font-size: 0.9375rem; }
}
</style>
