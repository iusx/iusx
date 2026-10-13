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
    <span class="text-tip-marker" aria-hidden="true">&gt;</span>
    <div class="text-tip-content"><slot /></div>
  </aside>
</template>

<style lang="scss" scoped>
.text-tip {
  display: grid;
  grid-template-columns: 1ch minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
  min-width: 0;
  margin: 1.25rem 0;
  padding: 0.75rem 1rem;
  border-left: 1px solid var(--article-border, #d4d4d4);
  border-radius: 0;
  background: var(--article-surface, transparent);
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 0.875rem;
  font-style: normal;
  line-height: 1.8;
  text-align: left;
  text-transform: none;

  &.is-prominent {
    padding: 1rem;
    border: 1px solid var(--article-border, #d4d4d4);
    font-size: 0.9375rem;
  }
}

.text-tip-marker {
  color: var(--article-accent, #007f73);
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
    border-color: var(--article-border, #363636);
    color: var(--article-text, #b3b3b3);
  }

  .text-tip-marker {
    color: var(--article-accent, #38e7cd);
  }
}

@media (max-width: 640px) {
  .text-tip {
    gap: 0.625rem;
    padding: 0.75rem;

    &.is-prominent {
      padding: 0.875rem;
    }
  }
}
</style>
