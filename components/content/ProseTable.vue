<script setup lang="ts">
defineOptions({ inheritAttrs: false });

function handleWheel(event: WheelEvent) {
  // Sideways gestures stay in the table; vertical gestures keep the page's Lenis animation.
  if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) event.stopPropagation();
}
</script>

<template>
  <div class="prose-table">
    <div class="prose-table-scroll" role="region" aria-label="文章表格，可横向滚动" tabindex="0" @wheel.passive="handleWheel">
      <table v-bind="$attrs">
        <slot />
      </table>
    </div>
    <span class="prose-table-hint" aria-hidden="true">宽表可左右滑动 <span>↔</span></span>
  </div>
</template>

<style scoped lang="scss">
.prose-table {
  --table-text: var(--article-text, #4a4a4a);
  --table-heading: var(--article-strong, #242424);
  --table-muted: var(--article-muted, #737373);
  --table-border: var(--article-border, #d4d4d4);
  --table-row-border: var(--article-soft-border, #e8e8e8);
  --table-surface: var(--article-surface, transparent);
  width: 100%;
  min-width: 0;
  margin: 2rem 0;
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
}

.dark-mode .prose-table {
  --table-text: var(--article-text, #b3b3b3);
  --table-heading: var(--article-strong, #ededed);
  --table-muted: var(--article-muted, #808080);
  --table-border: var(--article-border, #363636);
  --table-row-border: var(--article-soft-border, #222);
}

.prose-table-scroll {
  max-width: 100%;
  overflow-x: auto;
  border-radius: 0;
  background: var(--table-surface);
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--table-border) transparent;

  &:focus-visible {
    outline: 1px solid var(--article-accent, #007f73);
    outline-offset: 3px;
  }

  &::-webkit-scrollbar { height: 5px; }
  &::-webkit-scrollbar-thumb { background: var(--table-border); border-radius: 0; }
}

table {
  width: 100%;
  border-collapse: collapse;
  border-block: 1px solid var(--table-border);
  color: var(--table-text);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.7;
  text-align: left;

  :deep(th),
  :deep(td) {
    padding: 0.8rem 1.25rem;
    text-align: inherit;
    vertical-align: top;
    overflow-wrap: break-word;
  }

  :deep(th) {
    border-bottom: 1px solid var(--table-border);
    background: transparent;
    color: var(--table-heading);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  :deep(th:first-child), :deep(td:first-child) { padding-left: 0; }
  :deep(th:last-child), :deep(td:last-child) { padding-right: 0; }
  :deep(td:first-child) { color: var(--table-heading); }
  :deep([align="left"]) { text-align: left; }
  :deep([align="center"]) { text-align: center; }
  :deep([align="right"]) { text-align: right; }
  :deep(p) { margin: 0; }
  :deep(a) {
    color: var(--article-accent, #007f73);
    text-underline-offset: 3px;
    &:hover { text-decoration-thickness: 2px; }
    &:focus-visible { outline: 1px solid var(--article-accent, #007f73); outline-offset: 3px; }
  }
  :deep(strong), :deep(b) { color: inherit !important; }
}

.prose-table-hint { display: none; }

@media (max-width: 640px) {
  .prose-table { margin: 1.5rem 0; }

  table {
    :deep(th), :deep(td) { padding: 0.7rem 0.8rem; }
    :deep(th:first-child), :deep(td:first-child) { padding-left: 0; }
    :deep(th:last-child), :deep(td:last-child) { padding-right: 0; }
    :deep(th) { white-space: normal; }
  }

  // Keep comparison columns readable and aligned instead of stacking cells.
  .prose-table:has(tr > :nth-child(3)) {
    table { min-width: 38rem; }
    .prose-table-hint {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.45rem;
      color: var(--table-muted);
      font-size: 0.875rem;
      line-height: 1.5;
      span { font-size: 1rem; }
    }
  }

  .prose-table:has(tr > :nth-child(4)) table { min-width: 44rem; }
  .prose-table:has(tr > :nth-child(5)) table { min-width: 52rem; }
}
</style>
