<script setup lang="ts">
import { computed, ref } from "vue";
import { useAsyncData, useRequestURL } from "#imports";
import { readTimelineFile, timelineFilePath } from "~/utils/content-timeline";
import { displayText } from "~/utils/display-text";

const props = defineProps<{ file: string }>();
const requestURL = useRequestURL();
// The parent keys this component by file, so different files have independent caches.
// useAsyncData also waits during SSR and reuses that result during hydration.
const { data: entries, status, error, refresh } = useAsyncData(
  `content-timeline:${props.file}`,
  () => {
    const path = timelineFilePath(props.file);
    // Vite serves public assets in dev; production and prerender use Nitro's local fetch.
    const url = import.meta.dev && import.meta.server ? new URL(path, requestURL.origin).href : path;
    return $fetch<unknown>(url, { responseType: "json", retry: 0 });
  },
  { transform: readTimelineFile, deep: false },
);
const expanded = ref(false);
const previewCount = 5;
const visibleEntries = computed(() => expanded.value ? entries.value ?? [] : (entries.value ?? []).slice(0, previewCount));
const remainingCount = computed(() => Math.max((entries.value?.length ?? 0) - previewCount, 0));
</script>

<template>
  <div :class="{ 'is-empty': !entries?.length }" :aria-busy="status === 'pending'">
    <div v-if="status === 'pending'" class="timeline-file-message" role="status">正在读取时间线…</div>
    <div v-else-if="error" class="timeline-file-message" role="status">
      <span>无法读取时间线，请检查 JSON 路径和数据格式。</span>
      <button type="button" @click="refresh()">重新加载</button>
    </div>
    <template v-else>
      <div v-if="entries?.length" role="list">
        <TimelineItem
          v-for="entry in visibleEntries"
          :key="entry.key"
          :time="displayText(entry.time)"
          :datetime="displayText(entry.datetime)"
          :ago="displayText(entry.ago)"
          :kind="displayText(entry.kind)"
          :number="displayText(entry.number)"
          :status="displayText(entry.status)"
          :priority="displayText(entry.priority)"
          :title="displayText(entry.title)"
        >
          <p v-if="entry.text" class="timeline-file-text">{{ displayText(entry.text) }}</p>
          <template v-if="entry.details.length" #details>
            <div v-for="(detail, index) in entry.details" :key="index" class="timeline-file-detail">
              <span class="timeline-file-label">{{ displayText(detail.label) }}</span>
              <p class="timeline-file-text">{{ displayText(detail.text) }}</p>
            </div>
          </template>
        </TimelineItem>
      </div>
      <div v-if="remainingCount && !expanded" class="timeline-file-footer">
        <button type="button" class="timeline-file-expand" @click="expanded = true">
          <span>显示全部</span>
          <span class="timeline-file-remaining">剩余 {{ remainingCount }} 条 <span aria-hidden="true">↓</span></span>
        </button>
      </div>
      <div v-if="!entries?.length" class="timeline-file-message" role="status">暂无时间线记录。</div>
    </template>
  </div>
</template>

<style scoped>
.timeline-file-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.timeline-file-detail + .timeline-file-detail { margin-top: 1rem; }
.timeline-file-label { color: var(--timeline-muted); font-size: 0.6875rem; }
.timeline-file-footer { position: relative; padding-top: 0.25rem; background: var(--timeline-bg); }
.timeline-file-expand { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; box-sizing: border-box; padding: 0.625rem 0.875rem; border: 1px solid var(--timeline-border); background: var(--timeline-bg); color: var(--timeline-accent); font: inherit; font-size: 0.75rem; text-align: left; cursor: pointer; }
.timeline-file-expand:hover { border-color: var(--timeline-accent); }
.timeline-file-expand:focus-visible { outline: 1px solid var(--timeline-accent); outline-offset: 3px; }
.timeline-file-remaining { color: var(--timeline-muted); font-variant-numeric: tabular-nums; }
.timeline-file-remaining > span { margin-left: 0.5rem; color: var(--timeline-accent); }
.timeline-file-message { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem 1rem; padding: 1rem 0; color: var(--timeline-muted); font-size: 0.75rem; }
.timeline-file-message button { padding: 0; border: 0; background: transparent; color: var(--timeline-accent); font: inherit; text-decoration: underline; text-underline-offset: 0.2em; cursor: pointer; }
.timeline-file-message button:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
</style>
