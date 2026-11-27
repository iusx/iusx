<script setup lang="ts">
defineProps<{
  desc?: string;
}>();
</script>

<template>
  <aside class="text-summary">
    <p class="text-summary-label">Abstract</p>
    <p v-if="desc" class="text-summary-description">{{ desc }}</p>
  </aside>
</template>

<style lang="scss" scoped>
.text-summary {
  min-width: 0;
  margin: 2rem 0;
  padding: 0;
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.text-summary-label {
  margin: 0;
  color: var(--article-strong, #242424);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
}

.text-summary-description {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.dark-mode {
  .text-summary {
    color: var(--article-text, #b3b3b3);
  }

  .text-summary-label {
    color: var(--article-strong, #ededed);
  }
}

</style>
