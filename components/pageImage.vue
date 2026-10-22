<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion, useResizeObserver } from "@vueuse/core";

const props = defineProps({
  img: {
    type: String,
    default: "",
  },
  info: {
    type: String,
  },
  type: {
    type: String,
  },
  alt: {
    type: String,
    default: "",
  },
});

const images = computed(() => props.img.split(",").map(item => item.trim()).filter(Boolean)
  .map(item => /^(https?:\/\/|\/)/.test(item) ? item : `/img/${item}`));
const failedImages = ref<string[]>([]);
const mediaElement = ref<HTMLElement | null>(null);
const trackElement = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const previewSrc = ref("");
const reducedMotion = usePreferredReducedMotion();
const altText = computed(() => (props.alt || props.info || "文章插图")
  .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
const formatIndex = (index: number) => String(index).padStart(2, "0");
let pendingIndex: number | null = null;
let scrollEndTimer: ReturnType<typeof setTimeout> | undefined;

const markFailed = (src: string) => {
  if (!failedImages.value.includes(src)) failedImages.value.push(src);
};

function focusTrack() {
  const track = trackElement.value;
  if (track?.contains(document.activeElement)) track.focus({ preventScroll: true });
}

function retryImage(src: string) {
  focusTrack();
  failedImages.value = failedImages.value.filter(image => image !== src);
}

function checkImages() {
  for (const image of mediaElement.value?.querySelectorAll<HTMLImageElement>("img[data-article-image]") || []) {
    if (image.complete && !image.naturalWidth) markFailed(image.getAttribute("src") || "");
  }
}

function syncIndex() {
  const track = trackElement.value;
  if (!track?.clientWidth) return;
  if (pendingIndex !== null) {
    if (Math.abs(track.scrollLeft - pendingIndex * track.clientWidth) > 1) return;
    pendingIndex = null;
  }
  const index = Math.max(0, Math.min(images.value.length - 1,
    Math.round(track.scrollLeft / track.clientWidth)));
  if (index !== currentIndex.value) focusTrack();
  currentIndex.value = index;
}

function interruptNavigation() {
  clearTimeout(scrollEndTimer);
  pendingIndex = null;
  syncIndex();
}

function handleScroll() {
  syncIndex();
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(interruptNavigation, 180);
}

function goTo(index: number) {
  const track = trackElement.value;
  if (!track?.clientWidth) return;
  clearTimeout(scrollEndTimer);
  focusTrack();
  currentIndex.value = Math.max(0, Math.min(images.value.length - 1, index));
  pendingIndex = currentIndex.value;
  track.scrollTo({
    left: currentIndex.value * track.clientWidth,
    behavior: reducedMotion.value === "reduce" ? "auto" : "smooth",
  });
}

useResizeObserver(trackElement, () => {
  clearTimeout(scrollEndTimer);
  pendingIndex = null;
  trackElement.value?.scrollTo({ left: currentIndex.value * trackElement.value.clientWidth, behavior: "auto" });
});

watch(images, async () => {
  clearTimeout(scrollEndTimer);
  previewSrc.value = "";
  focusTrack();
  currentIndex.value = 0;
  pendingIndex = null;
  failedImages.value = [];
  await nextTick();
  trackElement.value?.scrollTo({ left: 0, behavior: "auto" });
  checkImages();
});

onMounted(checkImages);
onBeforeUnmount(() => clearTimeout(scrollEndTimer));
</script>

<template>
  <figure v-if="images.length" ref="mediaElement" class="article-media">
    <div v-if="images.length > 1" class="article-gallery" role="group" aria-roledescription="图片轮播" :aria-label="altText">
      <div ref="trackElement" class="gallery-track" tabindex="0" aria-label="图片列表，使用左右方向键切换"
        @scroll.passive="handleScroll" @scrollend="interruptNavigation"
        @pointerdown="interruptNavigation" @wheel.passive="interruptNavigation"
        @keydown.left.prevent="goTo(currentIndex - 1)" @keydown.right.prevent="goTo(currentIndex + 1)"
        @keydown.home.prevent="goTo(0)" @keydown.end.prevent="goTo(images.length - 1)">
        <div v-for="(item, index) in images" :key="`${item}-${index}`" class="gallery-slide"
          role="group" aria-roledescription="图片" :aria-label="`${index + 1} / ${images.length}`"
          :aria-hidden="index !== currentIndex" :inert="index !== currentIndex">
          <div v-if="failedImages.includes(item)" class="image-error">
            <p role="status">图片暂时无法显示</p>
            <div class="image-error-actions">
              <button type="button" :aria-label="`重新加载第 ${index + 1} 张图片`" @click="retryImage(item)">重新加载</button>
              <a :href="item" target="_blank" rel="noopener noreferrer"
                :aria-label="`查看原图：${altText}（${index + 1} / ${images.length}）`">↗ 查看原图</a>
            </div>
          </div>
          <button v-else type="button" class="image-link" aria-haspopup="dialog"
            :aria-label="`预览图片：${altText}（${index + 1} / ${images.length}）`" draggable="false"
            @click="previewSrc = item">
            <span class="image-original" aria-hidden="true">＋ 预览图片</span>
            <img :src="item" :alt="`${altText}（${index + 1} / ${images.length}）`" data-article-image
              :loading="index === 0 ? 'eager' : 'lazy'" decoding="async" draggable="false" @error="markFailed(item)" />
          </button>
        </div>
      </div>
      <div class="gallery-controls">
        <span class="gallery-count" role="status" aria-live="polite" aria-atomic="true" :aria-label="`第 ${currentIndex + 1} 张，共 ${images.length} 张`">
          <span>{{ formatIndex(currentIndex + 1) }}</span><span aria-hidden="true"> / {{ formatIndex(images.length) }}</span>
        </span>
        <div class="gallery-pages" role="group" aria-label="选择图片">
          <button v-for="(_, index) in images" :key="index" type="button" :aria-label="`查看第 ${index + 1} 张图片`"
            :aria-current="index === currentIndex ? 'true' : undefined" @click="goTo(index)"><span /></button>
        </div>
        <div class="gallery-arrows" role="group" aria-label="切换图片">
          <button type="button" aria-label="上一张图片" :disabled="currentIndex === 0" @click="goTo(currentIndex - 1)">←</button>
          <button type="button" aria-label="下一张图片" :disabled="currentIndex === images.length - 1" @click="goTo(currentIndex + 1)">→</button>
        </div>
      </div>
    </div>
    <template v-else>
      <div v-if="failedImages.includes(images[0])" class="image-error" role="status">图片暂时无法显示</div>
      <button v-else type="button" class="image-link" aria-haspopup="dialog"
        :aria-label="`预览图片：${altText}`" @click="previewSrc = images[0]">
        <span class="image-original" aria-hidden="true">＋ 预览图片</span>
        <img :src="images[0]" :alt="altText" data-article-image decoding="async" @error="markFailed(images[0])" />
      </button>
    </template>
    <figcaption v-if="info || type" class="info">
      <span v-if="info" class="info-title">{{ info }}</span>
      <img v-if="type" :src="'/img/page/' + type + '.png'" alt="图片版权标记" />
    </figcaption>
    <ImagePreview v-if="previewSrc" :src="previewSrc" :alt="altText" @close="previewSrc = ''" />
  </figure>
</template>

<style lang="scss" scoped>
.article-media {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-family: var(--article-font, monospace);
}
.image-link {
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--article-border, #d4d4d4);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: zoom-in;
  img { display: block; width: 100%; height: auto; border-radius: 0; }
}
.image-original {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 0.375rem 0.625rem;
  border-top: 1px solid var(--article-border, #d4d4d4);
  border-left: 1px solid var(--article-border, #d4d4d4);
  background: var(--article-bg, #fff);
  color: var(--article-muted, #737373);
  font-size: 0.6875rem;
  line-height: 1.5;
}
.image-link:hover .image-original { color: var(--article-accent, #007f73); }
.article-media :is(a, button, .gallery-track):focus-visible {
  outline: 1px solid var(--article-accent, #007f73);
  outline-offset: -4px;
}
.article-gallery {
  overflow: hidden;
  border: 1px solid var(--article-border, #d4d4d4);
  background: var(--article-bg, #fff);
}
.gallery-track {
  display: flex;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: min(32rem, 60svh);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
}
.gallery-slide {
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  .image-link { height: 100%; border: 0; }
  .image-link img { width: 100%; height: 100%; object-fit: contain; }
  .image-error {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 100%;
    padding: 1rem;
    border: 0;
    text-align: center;

    p { margin: 0; }
  }
}
.image-error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;

  :is(a, button) {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--article-border, #d4d4d4);
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: 1.5;
    text-decoration: none;
    cursor: pointer;

    &:hover { color: var(--article-accent, #007f73); }
  }
}
.gallery-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding-left: 0.75rem;
  border-top: 1px solid var(--article-border, #d4d4d4);
  color: var(--article-muted, #737373);
  font-size: 0.6875rem;
  line-height: 1;

  button {
    display: grid;
    place-items: center;
    min-width: 2.75rem;
    min-height: 2.75rem;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover:not(:disabled) { color: var(--article-accent, #007f73); }
    &:disabled { opacity: 0.3; cursor: default; }
  }
}
.gallery-count {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  > :first-child { color: var(--article-accent, #007f73); }
}
.gallery-pages {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow-x: auto;

  button { flex: 1 0 1rem; min-width: 1rem; padding-inline: 0.2rem; }
  span { width: 100%; height: 1px; background: var(--article-border, #d4d4d4); }
  button[aria-current="true"] span,
  button:hover span { background: var(--article-accent, #007f73); }
}
.gallery-arrows {
  display: flex;
  flex-shrink: 0;

  button { border-left: 1px solid var(--article-border, #d4d4d4); font-size: 1rem; }
}
.image-error {
  padding: 3rem 1rem;
  border: 1px solid var(--article-border, #d4d4d4);
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
}
.info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
  color: var(--article-muted, #737373);
  font-size: 0.75rem;
  line-height: 1.8;
  .info-title { min-width: 0; overflow-wrap: anywhere; }
  img { flex-shrink: 0; width: 61px; height: auto; }
}
.dark-mode .image-link img { opacity: 0.7; }
</style>
