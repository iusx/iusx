<script setup lang="ts">
defineProps<{
  title?: string;
  date?: string;
  datetime?: string;
  file?: string;
}>();
</script>

<template>
  <section class="text-timeline" :aria-label="title || '事件时间线'">
    <header v-if="title || date" class="timeline-heading">
      <span v-if="title" class="timeline-heading-title">{{ title }}</span>
      <time v-if="date" :datetime="datetime">{{ date }}</time>
    </header>
    <TimelineFileEntries v-if="file" :key="file" :file="file" class="timeline-entries" />
    <div v-else class="timeline-entries" role="list"><slot /></div>
  </section>
</template>

<style lang="scss" scoped>
.text-timeline {
  --timeline-text: var(--article-text, #4a4a4a);
  --timeline-strong: var(--article-strong, #242424);
  --timeline-muted: var(--article-muted, #737373);
  --timeline-border: var(--article-border, #d4d4d4);
  --timeline-soft-border: var(--article-soft-border, #e8e8e8);
  --timeline-accent: var(--article-accent, #007f73);
  --timeline-bg: var(--article-bg, #fff);
  --timeline-line: var(--article-muted, #737373);
  --timeline-time-width: 7rem;
  --timeline-rail-width: 1.5rem;
  --timeline-gap: 0.875rem;
  --timeline-group-gutter: 1.25rem;
  width: 100%;
  min-width: 0;
  margin: 2rem 0;
  color: var(--timeline-text);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 1rem;
  line-height: 1.8;
  text-align: left;
  text-transform: none;
}

.timeline-heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: baseline;
  gap: 0.375rem 1rem;
  padding: 0 0 1rem;
  color: var(--timeline-muted);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.timeline-heading-title { color: var(--timeline-strong); font-size: 1rem; font-weight: 600; }
.timeline-heading time { font-variant-numeric: tabular-nums; }
.timeline-entries { position: relative; padding-left: var(--timeline-group-gutter); }

.dark-mode .text-timeline {
  --timeline-text: var(--article-text, #b3b3b3);
  --timeline-strong: var(--article-strong, #ededed);
  --timeline-muted: var(--article-muted, #808080);
  --timeline-border: var(--article-border, #363636);
  --timeline-soft-border: var(--article-soft-border, #222);
  --timeline-accent: var(--article-accent, #38e7cd);
  --timeline-bg: var(--article-bg, #000);
  --timeline-line: var(--article-muted, #808080);
}

</style>
