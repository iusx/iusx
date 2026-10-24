<script setup lang="ts">
defineProps<{
  desc?: string;
}>();
</script>

<template>
  <aside class="text-summary">
    <p class="text-summary-label"><span aria-hidden="true">▪</span> overview</p>
    <p v-if="desc" class="text-summary-description">{{ desc }}</p>
  </aside>
</template>

<style lang="scss" scoped>
.text-summary {
  min-width: 0;
  margin: 1.5rem 0;
  padding: 0.875rem 1rem;
  border: 1px solid var(--article-border, #d4d4d4);
  border-radius: 0;
  background: var(--article-surface, transparent);
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.text-summary-label {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  margin: 0;
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.6;

  > span {
    color: var(--article-accent, #007f73);
  }
}

.text-summary-description {
  margin: 0.75rem 0 0;
  font-size: 0.9375rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.dark-mode {
  .text-summary {
    border-color: var(--article-border, #363636);
    color: var(--article-text, #b3b3b3);
  }

  .text-summary-label {
    color: var(--article-muted, #808080);

    > span {
      color: var(--article-accent, #38e7cd);
    }
  }
}

@media (max-width: 640px) {
  .text-summary {
    padding: 0.875rem;
  }
}
</style>
