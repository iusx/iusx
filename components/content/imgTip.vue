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
watch(imagePath, () => { imageFailed.value = false; });

onNuxtReady(() => {
  const image = imageElement.value;
  if (image?.complete && !image.naturalWidth) imageFailed.value = true;
});
</script>

<template>
  <figure class="image-tip">
    <a v-if="imagePath && !imageFailed" class="image-tip-media" :href="imagePath" target="_blank" rel="noopener noreferrer"
      :aria-label="`查看原图：${altText}`">
      <img ref="imageElement" class="image-tip-image" :src="imagePath" :alt="altText" loading="lazy" decoding="async"
        @error="imageFailed = true" />
    </a>
    <div v-else class="image-tip-fallback" role="status">图片暂时无法显示</div>
    <figcaption v-if="text || (imagePath && !imageFailed)" class="image-tip-caption">
      <div v-if="text" class="image-tip-description" v-html="text"></div>
      <a v-if="imagePath && !imageFailed" class="image-tip-original" :href="imagePath" target="_blank" rel="noopener noreferrer">查看原图 ↗</a>
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.image-tip {
  --image-surface: var(--article-surface, transparent);
  --image-caption: var(--article-muted, #656565);
  --image-emphasis: var(--article-strong, #242424);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas: "caption media";
  align-items: start;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
  margin: 1.75rem 0;
  border-radius: 0;
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.image-tip-media {
  grid-area: media;
  display: block;
  min-width: 0;
  padding: 0;
  border: 1px solid var(--article-border, #d4d4d4);
  background: var(--image-surface);

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
  margin: 0 auto;
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
  padding: 0 0 0 0.75rem;
  border-left: 1px solid var(--article-soft-border, #e8e8e8);
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
  align-self: flex-start;
  color: var(--article-accent, #007f73);
  font-size: 0.75rem;
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;

  &:hover { text-decoration: underline; text-underline-offset: 0.2em; }
  &:focus-visible { outline: 1px solid var(--article-accent, #007f73); outline-offset: 3px; }
}

.image-tip-fallback {
  grid-area: media;
  padding: 2.5rem 1rem;
  border: 1px solid var(--article-border, #d4d4d4);
  background: var(--image-surface);
  color: var(--image-caption);
  text-align: center;
  font-size: 0.875rem;
}

.dark-mode .image-tip {
  --image-caption: var(--article-muted, #808080);
  --image-emphasis: var(--article-strong, #ededed);
}

.dark-mode .image-tip .image-tip-image { opacity: 0.7; }

.image-tip:not(:has(.image-tip-description)) {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "media" "caption";
}

@media (max-width: 1024px) {
  .image-tip {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "media" "caption";
    gap: 0.75rem;
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
