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
  box-sizing: border-box;
  color: var(--compare-text, var(--article-text, #4a4a4a));
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
  text-align: left;
}
.compare-side + .compare-side { border-left: 1px solid var(--compare-soft, var(--article-soft-border, #e8e8e8)); }
.compare-side-title {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--compare-soft, var(--article-soft-border, #e8e8e8));
  color: var(--compare-strong, var(--article-strong, #242424));
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.compare-code { flex: 1; min-width: 0; overflow: hidden; }
.compare-code :deep(> *) { margin-top: 0 !important; margin-bottom: 0 !important; }
.compare-code :deep(pre) { margin: 0 !important; padding: 1rem !important; overflow-x: auto; }
.compare-code :deep(code) { font-family: inherit; font-size: 0.8125rem; }
.compare-code :deep(p) { color: inherit; font-size: inherit; line-height: inherit; }
@media (max-width: 760px) {
  .compare-side + .compare-side { border-top: 1px solid var(--compare-soft, var(--article-soft-border, #e8e8e8)); border-left: 0; }
}
</style>
