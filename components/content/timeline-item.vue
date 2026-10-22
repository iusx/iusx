<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  time?: string;
  datetime?: string;
  ago?: string;
  kind?: string;
  number?: string | number;
  status?: string;
  priority?: string | number;
  title?: string;
  expanded?: boolean;
  detailsLabel?: string;
}>(), { kind: "note", expanded: false, detailsLabel: "查看详情" });

const kinds: Record<string, { label: string; icon: string }> = {
  fact: { label: "事实", icon: "fact" },
  intent: { label: "意图", icon: "intent" },
  note: { label: "记录", icon: "note" },
  finding: { label: "发现", icon: "note" },
  digest: { label: "摘要", icon: "note" },
  goal: { label: "目标", icon: "intent" },
};
const kind = computed(() => {
  const value = String(props.kind ?? "note").trim();
  const key = value.toLowerCase();
  return Object.prototype.hasOwnProperty.call(kinds, key) ? kinds[key] : { label: value || "记录", icon: "note" };
});
const statuses: Record<string, { label: string; tone: string }> = {
  pending: { label: "待处理", tone: "neutral" },
  active: { label: "进行中", tone: "accent" },
  confirmed: { label: "已确认", tone: "accent" },
  done: { label: "已完成", tone: "accent" },
  blocked: { label: "已阻塞", tone: "blocked" },
  open: { label: "待处理", tone: "neutral" },
  exhausted: { label: "预算耗尽", tone: "blocked" },
  stopped: { label: "已停止", tone: "neutral" },
  met: { label: "已达成", tone: "accent" },
  origin: { label: "起点", tone: "neutral" },
};
const status = computed(() => {
  const value = String(props.status ?? "").trim();
  const key = value.toLowerCase();
  return Object.prototype.hasOwnProperty.call(statuses, key) ? statuses[key] : { label: value, tone: "neutral" };
});
const entryNumber = computed(() => String(props.number ?? "").trim().replace(/^#+/, ""));
const priority = computed(() => {
  const value = String(props.priority ?? "").trim();
  return /^\d+$/.test(value) ? `P${value}` : value;
});
</script>

<template>
  <div class="timeline-item" role="listitem">
    <div class="timeline-time">
      <time v-if="time" :datetime="datetime">{{ time }}</time>
      <span v-else class="timeline-time-empty" aria-label="未提供时间">—</span>
      <span v-if="ago" class="timeline-ago">{{ ago }}</span>
    </div>
    <div class="timeline-rail" aria-hidden="true">
      <span class="timeline-marker">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="kind.icon === 'fact'" d="M6 2h4M7 2v4l-4 6a1.2 1.2 0 0 0 1 2h8a1.2 1.2 0 0 0 1-2L9 6V2M5 10h6" />
          <template v-else-if="kind.icon === 'intent'">
            <circle cx="8" cy="8" r="5.5" />
            <path d="m10.5 5.5-1.3 3.7-3.7 1.3 1.3-3.7z" />
          </template>
          <path v-else d="M4 4h8M4 8h8M4 12h5" />
        </svg>
      </span>
    </div>
    <div class="timeline-content">
      <div class="timeline-meta">
        <span class="timeline-kind">{{ kind.label }}</span>
        <span v-if="entryNumber" class="timeline-number">#{{ entryNumber }}</span>
        <span v-if="status.label" class="timeline-status" :class="`is-${status.tone}`">
          <span class="timeline-status-dot" aria-hidden="true" />{{ status.label }}
        </span>
        <span v-if="priority" class="timeline-priority">{{ priority }}</span>
      </div>
      <div v-if="title" class="timeline-title">{{ title }}</div>
      <div v-if="$slots.default" class="timeline-body"><slot /></div>
      <details v-if="$slots.details" class="timeline-details" :open="expanded">
        <summary>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m4.5 2.5 3.5 3.5-3.5 3.5" /></svg>
          <span>{{ detailsLabel }}</span>
        </summary>
        <div class="timeline-body timeline-details-body"><slot name="details" /></div>
      </details>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timeline-item {
  display: grid;
  grid-template-columns: var(--timeline-time-width, 6rem) var(--timeline-rail-width, 1.5rem) minmax(0, 1fr);
  grid-template-areas: "time rail content";
  align-items: start;
  column-gap: var(--timeline-gap, 0.875rem);
  min-width: 0;
  padding: 1rem 0;
  color: var(--timeline-text, var(--article-text, #4a4a4a));
  font-size: inherit;
  line-height: 1.8;
  text-align: left;
  text-transform: none;
}
.timeline-time {
  grid-area: time;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  min-width: 0;
  color: var(--timeline-muted, #737373);
  font-size: 0.75rem;
  line-height: 1.5rem;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.timeline-ago { font-size: 0.6875rem; line-height: 1.5; }
.timeline-time-empty { opacity: 0.6; }
.timeline-rail { grid-area: rail; position: relative; display: flex; justify-content: center; }
.timeline-marker {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--timeline-rail-width, 1.5rem);
  height: var(--timeline-rail-width, 1.5rem);
  box-sizing: border-box;
  border: 1px solid var(--timeline-border, #d4d4d4);
  background: var(--timeline-bg, var(--article-bg, #fff));
  color: var(--timeline-accent, var(--article-accent, #007f73));
}
.timeline-marker svg { display: block; width: 0.875rem; height: 0.875rem; }
.timeline-content { grid-area: content; min-width: 0; }
.timeline-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem; min-height: 1.5rem; }
.timeline-kind, .timeline-status, .timeline-number, .timeline-priority {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.0625rem 0.375rem;
  border: 1px solid var(--timeline-soft-border, #e8e8e8);
  font-size: 0.6875rem;
  line-height: 1.25rem;
  overflow-wrap: anywhere;
}
.timeline-kind { color: var(--timeline-accent, #007f73); border-color: var(--timeline-border, #d4d4d4); }
.timeline-number, .timeline-priority { border-color: transparent; color: var(--timeline-muted, #737373); font-variant-numeric: tabular-nums; }
.timeline-status { color: var(--timeline-muted, #737373); }
.timeline-status.is-accent { color: var(--timeline-accent, #007f73); }
.timeline-status.is-blocked { border-style: dashed; }
.timeline-status-dot { flex: none; width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
.timeline-title { margin-top: 0.5rem; color: var(--timeline-strong, #242424); font-weight: 600; overflow-wrap: anywhere; }
.timeline-body { min-width: 0; margin-top: 0.5rem; overflow-wrap: anywhere; }
.timeline-body :deep(p) { margin: 0; color: inherit; font-size: inherit; line-height: inherit; }
.timeline-body :deep(> * + *) { margin-top: 0.75rem; }
.timeline-body :deep(> :first-child) { margin-top: 0 !important; }
.timeline-body :deep(> :last-child) { margin-bottom: 0 !important; }
.timeline-body :deep(a) { color: inherit; text-underline-offset: 0.2em; }
.timeline-body :deep(pre) { max-width: 100%; overflow: auto; }
.timeline-details { margin-top: 0.625rem; }
.timeline-details summary {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: fit-content;
  max-width: 100%;
  padding: 0.125rem 0;
  color: var(--timeline-muted, #737373);
  font-size: 0.75rem;
  line-height: 1.5;
  list-style: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}
.timeline-details summary::-webkit-details-marker { display: none; }
.timeline-details summary::marker { content: ""; }
.timeline-details summary svg { flex: none; width: 0.75rem; height: 0.75rem; stroke: currentColor; stroke-width: 1.2; }
.timeline-details[open] > summary svg { transform: rotate(90deg); }
.timeline-details summary:hover { color: var(--timeline-accent, #007f73); }
.timeline-details summary:focus-visible { outline: 1px solid var(--timeline-accent, #007f73); outline-offset: 3px; }
.timeline-details-body { padding: 0.75rem 0 0.25rem 0.875rem; border-left: 1px solid var(--timeline-border, #d4d4d4); }

@media (max-width: 640px) {
  .timeline-item {
    grid-template-columns: var(--timeline-rail-width, 1.25rem) minmax(0, 1fr);
    grid-template-areas: "rail time" "rail content";
    row-gap: 0.375rem;
    column-gap: var(--timeline-gap, 0.75rem);
    padding: 0.875rem 0;
  }
  .timeline-time { flex-direction: row; flex-wrap: wrap; align-items: baseline; gap: 0.5rem; text-align: left; line-height: 1.25rem; }
  .timeline-meta { gap: 0.25rem; }
  .timeline-marker svg { width: 0.75rem; height: 0.75rem; }
}
</style>
