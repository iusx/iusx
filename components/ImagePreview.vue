<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, unref, watch, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

const props = defineProps<{ src: string; alt?: string }>();
const emit = defineEmits<{ close: [] }>();

type Scroller = { isStopped: boolean; stop: () => void; start: () => void };
const smoothScroller = inject<Ref<Scroller | null> | null>("smoothScroller", null);
const dialog = ref<HTMLDialogElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const image = ref<HTMLImageElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const naturalSize = ref({ width: 0, height: 0 });
const stageSize = ref({ width: 0, height: 0 });
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
const dragging = ref(false);
const imageFailed = ref(false);
const copying = ref(false);
const copyMessage = ref("");
const minZoom = 0.25;
const maxZoom = 4;
let dragStart: { id: number; x: number; y: number; panX: number; panY: number } | null = null;
let restorePage = () => {};
let copyFeedbackTimer: ReturnType<typeof setTimeout> | undefined;

const ready = computed(() => naturalSize.value.width > 0 && !imageFailed.value);
const copied = computed(() => copyMessage.value === "图片已复制");
const fileName = computed(() => {
  const name = props.src.split(/[?#]/)[0]?.split("/").pop() || "图片预览";
  try { return decodeURIComponent(name); } catch { return name; }
});
const fit = computed(() => Math.min(1,
  Math.max(1, stageSize.value.width - 32) / (naturalSize.value.width || 1),
  Math.max(1, stageSize.value.height - 32) / (naturalSize.value.height || 1)));
const displaySize = computed(() => ({
  width: naturalSize.value.width * fit.value * zoom.value,
  height: naturalSize.value.height * fit.value * zoom.value,
}));
const canPan = computed(() => displaySize.value.width > stageSize.value.width
  || displaySize.value.height > stageSize.value.height);
const imageStyle = computed(() => ({
  width: `${displaySize.value.width}px`,
  height: `${displaySize.value.height}px`,
  transform: `translate(-50%, -50%) translate(${pan.value.x}px, ${pan.value.y}px)`,
  visibility: ready.value ? "visible" as const : "hidden" as const,
}));

function clampPan(x: number, y: number) {
  const maxX = Math.max(0, (displaySize.value.width - stageSize.value.width) / 2 + 16);
  const maxY = Math.max(0, (displaySize.value.height - stageSize.value.height) / 2 + 16);
  pan.value = { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
}

function setZoom(value: number) {
  zoom.value = Math.round(Math.max(minZoom, Math.min(maxZoom, value)) * 100) / 100;
  clampPan(pan.value.x, pan.value.y);
}

function resetZoom() {
  zoom.value = 1;
  pan.value = { x: 0, y: 0 };
}

function handleWheel(event: WheelEvent) {
  if (ready.value && event.deltaY) setZoom(zoom.value * (event.deltaY < 0 ? 1.1 : 1 / 1.1));
}

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || !canPan.value) return;
  dragStart = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.value.x, panY: pan.value.y };
  dragging.value = true;
  image.value?.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function moveDrag(event: PointerEvent) {
  if (!dragStart || dragStart.id !== event.pointerId) return;
  clampPan(dragStart.panX + event.clientX - dragStart.x, dragStart.panY + event.clientY - dragStart.y);
}

function endDrag() {
  dragStart = null;
  dragging.value = false;
}

function handleLoad() {
  if (!image.value?.naturalWidth) return;
  naturalSize.value = { width: image.value.naturalWidth, height: image.value.naturalHeight };
  imageFailed.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  // Keep preview shortcuts from reaching the article's carousel.
  event.stopPropagation();
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (["+", "=", "-", "0"].includes(event.key)) {
    event.preventDefault();
    if (event.key === "0") resetZoom();
    else if (ready.value) setZoom(zoom.value + (event.key === "-" ? -0.25 : 0.25));
  }
}

async function pngBlob() {
  const response = await fetch(props.src);
  if (!response.ok) throw new Error("Image request failed");
  const blob = await response.blob();
  if (blob.type === "image/png") return blob;

  // PNG is the image format supported across clipboard implementations.
  const url = URL.createObjectURL(blob);
  try {
    const source = new Image();
    source.src = url;
    await source.decode();
    const canvas = document.createElement("canvas");
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(source, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(result => result ? resolve(result) : reject(new Error("Image conversion failed")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function copyImage() {
  if (copying.value) return;
  clearTimeout(copyFeedbackTimer);
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    copyMessage.value = "当前浏览器不支持复制图片，请右键或长按图片复制。";
    return;
  }
  copying.value = true;
  copyMessage.value = "";
  try {
    // Start write in the click handler; Safari needs the user activation here.
    await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob() })]);
    copyMessage.value = "图片已复制";
    copyFeedbackTimer = setTimeout(() => { copyMessage.value = ""; }, 2200);
  } catch {
    copyMessage.value = "复制失败，请检查剪贴板权限，或右键／长按图片复制。";
  } finally {
    copying.value = false;
  }
}

function close() {
  dialog.value?.close();
}

function handleClose() {
  restorePage();
  emit("close");
}

useResizeObserver(stage, entries => {
  const rect = entries[0]?.contentRect;
  if (!rect) return;
  stageSize.value = { width: rect.width, height: rect.height };
  clampPan(pan.value.x, pan.value.y);
});

watch(() => props.src, () => {
  clearTimeout(copyFeedbackTimer);
  naturalSize.value = { width: 0, height: 0 };
  imageFailed.value = false;
  copyMessage.value = "";
  resetZoom();
});

onMounted(() => {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  let pausedScroller: Scroller | null = null;
  function resumeScroller() {
    pausedScroller?.start();
    pausedScroller = null;
  }
  const stopWatching = watch(() => unref(smoothScroller), scroller => {
    resumeScroller();
    if (scroller && !scroller.isStopped) {
      pausedScroller = scroller;
      scroller.stop();
    }
  }, { immediate: true, flush: "sync" });
  restorePage = () => {
    stopWatching();
    resumeScroller();
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    restorePage = () => {};
  };
  dialog.value?.showModal();
  closeButton.value?.focus({ preventScroll: true });
  // Cached images can finish before the load handler is attached.
  if (image.value?.complete) {
    if (image.value.naturalWidth) handleLoad();
    else imageFailed.value = true;
  }
});

onBeforeUnmount(() => {
  clearTimeout(copyFeedbackTimer);
  dialog.value?.close();
  restorePage();
});
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="image-preview" aria-label="图片预览" data-lenis-prevent
      @close="handleClose" @keydown="handleKeydown" @click.self="close">
      <div ref="stage" class="preview-stage" :class="{ 'can-pan': canPan, 'is-dragging': dragging }"
        @click.self="close" @wheel.prevent="handleWheel">
        <img ref="image" class="preview-image" :src="src" :alt="alt || '文章插图'" :style="imageStyle" draggable="false"
          @load="handleLoad" @error="imageFailed = true" @dblclick="zoom === 1 ? setZoom(2) : resetZoom()"
          @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" @lostpointercapture="endDrag" />
        <p v-if="!ready" class="preview-placeholder" role="status">
          {{ imageFailed ? '图片加载失败，请关闭后重试。' : '正在加载图片…' }}
        </p>
      </div>
      <p v-if="copyMessage" class="preview-message" :class="{ 'is-success': copied }" role="status" aria-live="polite">{{ copyMessage }}</p>
      <footer class="preview-caption">
        <span class="preview-file" :title="fileName">{{ fileName }}</span>
        <div class="preview-actions" role="group" aria-label="图片操作">
          <div class="preview-zoom-tools" role="group" aria-label="缩放图片">
            <button type="button" class="preview-step" aria-label="缩小图片" title="缩小（−）"
              :disabled="!ready || zoom <= minZoom" @click="setZoom(zoom - 0.25)">−</button>
            <button type="button" class="preview-zoom" :aria-label="`重置缩放，当前 ${Math.round(zoom * 100)}%`"
              title="适应窗口（0）" :disabled="!ready" @click="resetZoom">{{ Math.round(zoom * 100) }}%</button>
            <button type="button" class="preview-step" aria-label="放大图片" title="放大（+）"
              :disabled="!ready || zoom >= maxZoom" @click="setZoom(zoom + 0.25)">+</button>
          </div>
          <button type="button" class="preview-copy" :class="{ 'is-copied': copied }" aria-label="复制图片"
            :disabled="!ready || copying" @click="copyImage">{{ copying ? '复制中…' : copied ? '已复制' : '复制图片' }}</button>
          <button ref="closeButton" type="button" class="preview-close" aria-label="关闭图片预览" title="关闭（Esc）" @click="close">关闭</button>
        </div>
      </footer>
    </dialog>
  </Teleport>
</template>

<style lang="scss" scoped>
.image-preview {
  --preview-bg: #fff;
  --preview-text: #4a4a4a;
  --preview-muted: #737373;
  --preview-border: #d4d4d4;
  --preview-accent: #007f73;
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: min(1200px, calc(100% - 64px));
  max-width: none;
  height: min(860px, calc(100dvh - 64px));
  max-height: none;
  margin: auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--preview-border);
  border-radius: 0;
  background: var(--preview-bg);
  color: var(--preview-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "PingFang SC", "Microsoft YaHei", monospace;
  font-size: 12px;
  line-height: 1.6;
  text-align: left;
  text-transform: none;
  overscroll-behavior: contain;
  color-scheme: light;

  &[open] { display: flex; flex-direction: column; }
  &::backdrop { background: rgb(0 0 0 / 45%); }

  .dark-mode & {
    --preview-bg: #000;
    --preview-text: #b3b3b3;
    --preview-muted: #808080;
    --preview-border: #363636;
    --preview-accent: #38e7cd;
    color-scheme: dark;

    &::backdrop { background: rgb(0 0 0 / 70%); }
  }

  button {
    appearance: none;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: 40px;
    margin: 0;
    padding: 0 8px;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:hover:not(:disabled) { color: var(--preview-accent); }
    &:focus-visible { outline: 1px solid var(--preview-accent); outline-offset: -3px; }
    &:disabled { opacity: 0.3; cursor: default; }
  }
}
.preview-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  touch-action: none;
}
.image-preview .preview-image {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  opacity: 1;
  filter: none;
  user-select: none;
  touch-action: none;
  cursor: zoom-in;
}
.can-pan .preview-image { cursor: grab; }
.is-dragging .preview-image { cursor: grabbing; }
.preview-placeholder {
  position: absolute;
  inset: 45% 16px auto;
  margin: 0;
  color: var(--preview-muted);
  text-align: center;
}
.preview-caption {
  display: flex;
  flex: none;
  align-items: center;
  gap: 24px;
  min-width: 0;
  min-height: 56px;
  padding: 0 16px;
  border-top: 1px solid var(--preview-border);
  color: var(--preview-muted);
}
.preview-file {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview-actions { display: flex; flex: none; align-items: center; gap: 16px; }
.preview-zoom-tools { display: flex; align-items: center; }
.image-preview .preview-step { width: 36px; font-size: 16px; }
.image-preview .preview-zoom { width: 56px; font-variant-numeric: tabular-nums; }
.image-preview .preview-copy { width: 80px; }
.image-preview .is-copied { color: var(--preview-accent); }
.preview-message {
  flex: none;
  margin: 0;
  padding: 8px 16px;
  border-top: 1px solid var(--preview-border);
  color: var(--preview-text);
  overflow-wrap: anywhere;

  &.is-success {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
}
@media (max-width: 640px) {
  .image-preview {
    width: calc(100% - max(12px, env(safe-area-inset-left)) - max(12px, env(safe-area-inset-right)));
    height: calc(100dvh - max(12px, env(safe-area-inset-top)) - max(12px, env(safe-area-inset-bottom)));
  }
  .preview-caption { min-height: 52px; padding-inline: 8px; }
  .preview-file { display: none; }
  .preview-actions { flex: 1; gap: 8px; }
  .preview-zoom-tools { margin-right: auto; }
  .image-preview .preview-step { width: 32px; }
  .image-preview .preview-zoom { width: 48px; }
}
</style>
