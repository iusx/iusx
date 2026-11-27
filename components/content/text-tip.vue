<script setup>
defineProps({
  type: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <aside class="text-tip" :class="{ 'is-prominent': type === 'big' }">
    <span class="text-tip-marker">{{ type === 'big' ? 'Important:' : 'Note:' }}</span>
    <div class="text-tip-content"><slot /></div>
  </aside>
</template>

<style lang="scss" scoped>
.text-tip {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
  min-width: 0;
  margin: 1.75rem 0;
  padding: 0;
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 1rem;
  font-style: normal;
  line-height: 1.8;
  text-align: left;
  text-transform: none;

  &.is-prominent {
    color: var(--article-strong, #242424);
    .text-tip-marker { color: var(--article-accent, #007f73); }
  }
}

.text-tip-marker {
  color: var(--article-muted, #737373);
  font-size: 0.875rem;
  line-height: calc(1.8 / 0.875);
}

.text-tip-content {
  min-width: 0;
  overflow-wrap: anywhere;

  :deep(p),
  :deep(li) {
    color: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  :deep(p) {
    margin: 0;
  }

  :deep(> * + *) {
    margin-top: 0.75rem;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 0;
    padding-left: 1.5rem;
  }
}

.dark-mode {
  .text-tip {
    color: var(--article-text, #b3b3b3);
    &.is-prominent { color: var(--article-strong, #ededed); }
  }

  .text-tip-marker {
    color: var(--article-muted, #808080);
  }
  .is-prominent .text-tip-marker { color: var(--article-accent, #38e7cd); }
}

@media (max-width: 640px) {
  .text-tip {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.375rem;
  }
}
</style>
