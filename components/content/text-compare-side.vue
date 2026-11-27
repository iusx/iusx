<script setup lang="ts">
import { displayText } from "~/utils/display-text";

const props = withDefaults(defineProps<{ title?: string }>(), { title: "代码" });
</script>

<template>
  <section class="compare-side" :aria-label="title">
    <header class="compare-side-title">{{ displayText(title) }}</header>
    <div class="compare-code"><slot /></div>
  </section>
</template>

<style scoped>
.compare-side {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-right: 1.25rem;
  box-sizing: border-box;
  color: var(--compare-text, var(--article-text, #4a4a4a));
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 1rem;
  line-height: 1.7;
  text-align: left;
}
.compare-side + .compare-side { padding-right: 0; padding-left: 1.25rem; }
.compare-side-title {
  padding: 0 0 0.75rem;
  color: var(--compare-muted, var(--article-muted, #737373));
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.compare-code { flex: 1; min-width: 0; overflow: hidden; }
.compare-code :deep(> *) { margin-top: 0 !important; margin-bottom: 0 !important; }
.compare-code :deep(pre) { margin: 0 !important; padding: 0.5rem 1rem !important; border: 0; overflow-x: auto; }
.compare-code :deep(code) { font-family: inherit; font-size: 0.875rem; }
.compare-code :deep(p) { color: inherit; font-size: inherit; line-height: inherit; }
@media (max-width: 760px) {
  .compare-side { padding-right: 0; }
  .compare-side + .compare-side { margin-top: 1.5rem; padding-left: 0; }
}
</style>
