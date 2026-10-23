<script setup lang="ts">
import { ref } from "vue";
import { displayText } from "~/utils/display-text";

withDefaults(defineProps<{ title?: string }>(), { title: "代码对照" });

const MIN_SPLIT = 20;
const MAX_SPLIT = 80;
const split = ref(50);
const resizing = ref(false);
const grid = ref<HTMLElement | null>(null);

function updateSplit(clientX: number) {
  const rect = grid.value?.getBoundingClientRect();
  if (!rect?.width) return;
  split.value = Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, ((clientX - rect.left) / rect.width) * 100));
}
function startResize(event: PointerEvent) {
  if (event.button !== 0) return;
  event.preventDefault();
  resizing.value = true;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}
function moveResize(event: PointerEvent) {
  if (resizing.value) updateSplit(event.clientX);
}
function endResize(event: PointerEvent) {
  if (!resizing.value) return;
  resizing.value = false;
  const handle = event.currentTarget as HTMLElement;
  if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
}
function keyResize(event: KeyboardEvent) {
  const step = event.shiftKey ? 10 : 2;
  let next = split.value;
  if (event.key === "ArrowLeft") next -= step;
  else if (event.key === "ArrowRight") next += step;
  else if (event.key === "Home") next = MIN_SPLIT;
  else if (event.key === "End") next = MAX_SPLIT;
  else return;
  event.preventDefault();
  split.value = Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, next));
}
</script>

<template>
  <figure class="text-compare" :aria-label="title">
    <header class="compare-heading">
      <span class="compare-heading-title"><span aria-hidden="true">&gt;</span> {{ displayText(title) }}</span>
      <span class="compare-heading-note">左右对照</span>
    </header>
    <div class="compare-wrap" :class="{ 'is-resizing': resizing }" :style="{ '--compare-split': `${split}%` }">
      <div ref="grid" class="compare-grid"><slot /></div>
      <div
        class="compare-resizer"
        role="separator"
        aria-orientation="vertical"
        aria-label="拖动调整左右宽度"
        :aria-valuemin="MIN_SPLIT"
        :aria-valuemax="MAX_SPLIT"
        :aria-valuenow="Math.round(split)"
        tabindex="0"
        @pointerdown="startResize"
        @pointermove="moveResize"
        @pointerup="endResize"
        @pointercancel="endResize"
        @dblclick="split = 50"
        @keydown="keyResize"
      />
    </div>
  </figure>
</template>

<style scoped>
.text-compare {
  --compare-bg: var(--article-bg, #fff);
  --compare-text: var(--article-text, #4a4a4a);
  --compare-strong: var(--article-strong, #242424);
  --compare-muted: var(--article-muted, #737373);
  --compare-border: var(--article-border, #d4d4d4);
  --compare-soft: var(--article-soft-border, #e8e8e8);
  --compare-accent: var(--article-accent, #007f73);
  min-width: 0;
  margin: 1.75rem 0;
  border: 1px solid var(--compare-border);
  color: var(--compare-text);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
  text-align: left;
}
.dark-mode .text-compare {
  --compare-bg: var(--article-bg, #000);
  --compare-text: var(--article-text, #b3b3b3);
  --compare-strong: var(--article-strong, #ededed);
  --compare-muted: var(--article-muted, #808080);
  --compare-border: var(--article-border, #363636);
  --compare-soft: var(--article-soft-border, #222);
  --compare-accent: var(--article-accent, #38e7cd);
}
.compare-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.375rem 1rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--compare-border);
  color: var(--compare-muted);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.compare-heading-title { color: var(--compare-strong); }
.compare-heading-title > span { color: var(--compare-accent); }
.compare-heading-note { font-size: 0.6875rem; }
.compare-wrap { position: relative; }
.compare-grid {
  display: grid;
  grid-template-columns: minmax(0, var(--compare-split, 50%)) minmax(0, calc(100% - var(--compare-split, 50%)));
  align-items: stretch;
}
.compare-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--compare-split, 50%);
  z-index: 1;
  width: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
  cursor: col-resize;
  touch-action: none;
}
.compare-resizer::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: transparent;
  transition: background 0.15s;
}
.compare-resizer::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 24px;
  background: repeating-linear-gradient(to bottom, var(--compare-muted) 0 1px, transparent 1px 5px);
  opacity: 0.55;
  transform: translate(-50%, -50%);
}
.compare-resizer:hover::before, .compare-resizer:focus-visible::before, .is-resizing .compare-resizer::before { background: var(--compare-accent); }
.compare-resizer:hover::after, .compare-resizer:focus-visible::after, .is-resizing .compare-resizer::after { opacity: 1; }
.compare-resizer:focus-visible { outline: 1px solid var(--compare-accent); outline-offset: -3px; }
.is-resizing { user-select: none; }
@media (max-width: 760px) {
  .compare-grid { grid-template-columns: minmax(0, 1fr); }
  .compare-resizer { display: none; }
}
</style>
