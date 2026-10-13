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
    <div v-if="topic" class="wise-topic">
      <span class="wise-marker" aria-hidden="true">▪</span>
      <span>{{ topic }}</span>
    </div>
    <blockquote class="wise-content"><slot /></blockquote>
    <figcaption v-if="by" class="wise-by">
      <span aria-hidden="true">/</span> {{ by }}
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.wise-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin: 1.5rem 0;
  border: 1px solid var(--article-border, #d4d4d4);
  border-radius: 0;
  background: var(--article-surface, transparent);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.wise-topic {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--article-soft-border, #e8e8e8);
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
  line-height: 1.6;

  > span:last-child {
    min-width: 0;
    overflow-wrap: anywhere;
  }
}

.wise-marker {
  flex-shrink: 0;
  color: var(--article-accent, #007f73);
}

.wise-content {
  min-width: 0;
  margin: 0;
  padding: 1rem;
  border: 0;
  color: var(--article-text, #4a4a4a);
  font-size: 0.9375rem;
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
    padding: 0 0 0 0.875rem;
    border-left: 1px solid var(--article-border, #d4d4d4);
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
  padding: 0 1rem 0.875rem;
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-wrap: anywhere;

  > span {
    color: var(--article-faint, #999);
  }
}

.dark-mode {
  .wise-layout {
    border-color: var(--article-border, #363636);
  }

  .wise-topic {
    border-color: var(--article-soft-border, #222);
  }

  .wise-topic,
  .wise-by {
    color: var(--article-muted, #808080);
  }

  .wise-marker {
    color: var(--article-accent, #38e7cd);
  }

  .wise-content {
    color: var(--article-text, #b3b3b3);

    :deep(blockquote) {
      border-color: var(--article-border, #363636);
      color: var(--article-muted, #808080);
    }
  }

  .wise-by > span {
    color: var(--article-faint, #606060);
  }
}

@media (max-width: 640px) {
  .wise-topic,
  .wise-content {
    padding: 0.875rem;
  }

  .wise-by {
    padding: 0 0.875rem 0.875rem;
  }
}
</style>
