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
      <span v-if="title" class="timeline-heading-title"><span aria-hidden="true">&gt;</span> {{ title }}</span>
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
  --timeline-time-width: 6rem;
  --timeline-rail-width: 1.5rem;
  --timeline-gap: 0.875rem;
  width: 100%;
  min-width: 0;
  margin: 1.5rem 0;
  color: var(--timeline-text);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 0.875rem;
  line-height: 1.8;
  text-align: left;
  text-transform: none;
}

.timeline-heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.375rem 1rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--timeline-border);
  color: var(--timeline-muted);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.timeline-heading-title { color: var(--timeline-strong); }
.timeline-heading-title > span { color: var(--timeline-accent); }
.timeline-heading time { font-variant-numeric: tabular-nums; }
.timeline-entries { position: relative; }
.timeline-entries::before {
  content: "";
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  left: calc(var(--timeline-time-width) + var(--timeline-gap) + var(--timeline-rail-width) / 2);
  width: 1px;
  background: var(--timeline-border);
  pointer-events: none;
}
.timeline-entries:empty::before { display: none; }
.timeline-entries.is-empty::before { display: none; }

.dark-mode .text-timeline {
  --timeline-text: var(--article-text, #b3b3b3);
  --timeline-strong: var(--article-strong, #ededed);
  --timeline-muted: var(--article-muted, #808080);
  --timeline-border: var(--article-border, #363636);
  --timeline-soft-border: var(--article-soft-border, #222);
  --timeline-accent: var(--article-accent, #38e7cd);
  --timeline-bg: var(--article-bg, #000);
}

@media (max-width: 640px) {
  .text-timeline { --timeline-rail-width: 1.25rem; --timeline-gap: 0.75rem; }
  .timeline-entries::before { left: calc(var(--timeline-rail-width) / 2); }
}
</style>
