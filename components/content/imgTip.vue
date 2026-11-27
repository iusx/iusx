<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  url: { type: String, default: "" },
  text: { type: String, default: "" },
  alt: { type: String, default: "" },
});

const imagePath = computed(() => {
  if (!props.url) return "";
  return /^(https?:\/\/|\/)/.test(props.url) ? props.url : `/img/book/${props.url}`;
});
const altText = computed(() => props.alt || props.text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "文章插图");
const imageElement = ref(null);
const imageFailed = ref(false);
const previewSrc = ref("");
watch(imagePath, () => {
  imageFailed.value = false;
  previewSrc.value = "";
});

onNuxtReady(() => {
  const image = imageElement.value;
  if (image?.complete && !image.naturalWidth) imageFailed.value = true;
});
</script>

<template>
  <figure class="image-tip">
    <button v-if="imagePath && !imageFailed" type="button" class="image-tip-media" aria-haspopup="dialog"
      :aria-label="`预览图片：${altText}`" @click="previewSrc = imagePath">
      <img ref="imageElement" class="image-tip-image" :src="imagePath" :alt="altText" loading="lazy" decoding="async"
        @error="imageFailed = true" />
    </button>
    <div v-else class="image-tip-fallback" role="status">图片暂时无法显示</div>
    <figcaption v-if="text || (imagePath && !imageFailed)" class="image-tip-caption">
      <div v-if="text" class="image-tip-description" v-html="text"></div>
      <button v-if="imagePath && !imageFailed" type="button" class="image-tip-original" aria-haspopup="dialog"
        :aria-label="`预览图片：${altText}`" @click="previewSrc = imagePath">预览图片 ＋</button>
    </figcaption>
    <ImagePreview v-if="previewSrc" :src="previewSrc" :alt="altText" @close="previewSrc = ''" />
  </figure>
</template>

<style lang="scss" scoped>
.image-tip {
  --image-surface: var(--article-surface, transparent);
  --image-caption: var(--article-muted, #656565);
  --image-emphasis: var(--article-strong, #242424);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "media" "caption";
  align-items: start;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  margin: 2rem 0;
  border-radius: 0;
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.image-tip-media {
  appearance: none;
  grid-area: media;
  display: block;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  background: var(--image-surface);
  color: inherit;
  font: inherit;
  cursor: zoom-in;

  &:focus-visible {
    outline: 1px solid var(--article-accent, #007f73);
    outline-offset: -3px;
  }
}

.image-tip .image-tip-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 0;
  opacity: 1;
  border-radius: 0;
}

.image-tip-caption {
  grid-area: caption;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.625rem;
  min-width: 0;
  padding: 0;
  color: var(--image-caption);
  font-size: 0.875rem;
  line-height: 1.8;
}

.image-tip-description {
  min-width: 0;
  overflow-wrap: anywhere;

  :deep(b), :deep(strong) { color: var(--image-emphasis) !important; font-weight: 600; }
  :deep(p) { margin: 0; color: inherit; font-size: inherit; line-height: inherit; }
  :deep(p + p) { margin-top: 0.75rem; }
  :deep(a) {
    color: var(--article-accent, #007f73);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    &:hover { text-decoration-thickness: 2px; }
    &:focus-visible { outline: 1px solid var(--article-accent, #007f73); outline-offset: 3px; }
  }
}

.image-tip-original {
  appearance: none;
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--article-accent, #007f73);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;
  cursor: zoom-in;

  &:hover { text-decoration: underline; text-underline-offset: 0.2em; }
  &:focus-visible { outline: 1px solid var(--article-accent, #007f73); outline-offset: 3px; }
}

.image-tip-fallback {
  grid-area: media;
  padding: 2.5rem 0;
  background: var(--image-surface);
  color: var(--image-caption);
  text-align: left;
  font-size: 0.875rem;
}

.dark-mode .image-tip {
  --image-caption: var(--article-muted, #808080);
  --image-emphasis: var(--article-strong, #ededed);
}

.dark-mode .image-tip .image-tip-image { opacity: 0.7; }

@media (max-width: 1024px) {
  .image-tip {
    margin-block: 1.5rem;
  }
}

@media (max-width: 640px) {
  .image-tip-original {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0.125rem 0.25rem;
  }
}
</style>
