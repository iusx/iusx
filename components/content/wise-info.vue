<script setup>
defineProps({
  by: {
    type: String,
    default: "",
  },
  topic: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <figure class="wise-layout">
    <div class="wise-topic">
      <span class="wise-marker">Quotation</span>
      <span v-if="topic">{{ topic }}</span>
    </div>
    <blockquote class="wise-content"><slot /></blockquote>
    <figcaption v-if="by" class="wise-by">
      <span>Source:</span> {{ by }}
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.wise-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin: 2rem 0;
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.wise-topic {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.625rem;
  padding: 0 0 0.75rem;
  color: var(--article-muted, #737373);
  font-size: 0.875rem;
  line-height: 1.6;

  > span:last-child {
    min-width: 0;
    overflow-wrap: anywhere;
  }
}

.wise-marker {
  flex-shrink: 0;
  color: var(--article-strong, #242424);
}

.wise-layout .wise-content {
  min-width: 0;
  margin: 0;
  padding: 0 0 0 1.5rem;
  border: 0;
  color: var(--article-text, #4a4a4a);
  font-size: 1rem;
  font-style: normal;
  line-height: 1.85;
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  :deep(> * + *) {
    margin-top: 0.875rem;
  }

  :deep(blockquote) {
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    padding: 0 0 0 1.5rem;
    border: 0;
    color: var(--article-muted, #737373);
    font-style: normal;
  }

  :deep(blockquote > * + *) {
    margin-top: 0.75rem;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5rem;
  }

  :deep(a) {
    color: inherit;
    text-underline-offset: 0.2em;
  }
}

.wise-by {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  padding: 0.75rem 0 0 1.5rem;
  color: var(--article-muted, #737373);
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-wrap: anywhere;

  > span {
    color: var(--article-muted, #737373);
  }
}

.dark-mode {
  .wise-topic,
  .wise-by {
    color: var(--article-muted, #808080);
  }

  .wise-marker {
    color: var(--article-strong, #ededed);
  }

  .wise-content {
    color: var(--article-text, #b3b3b3);

    :deep(blockquote) {
      color: var(--article-muted, #808080);
    }
  }

  .wise-by > span {
    color: var(--article-muted, #808080);
  }
}

@media (max-width: 640px) {
  .wise-layout .wise-content { padding-left: 1rem; }
  .wise-by { padding-left: 1rem; }
}
</style>
