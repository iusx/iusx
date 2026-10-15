<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  info?: string;
  img?: string;
  type?: string;
}>();

const images = computed(() =>
  (props.img ?? "")
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean),
);

function imageUrl(image: string) {
  return /^(?:https?:\/\/|\/)/.test(image) ? image : `/img/${image}`;
}
</script>

<template>
  <aside v-if="type === 'tip'" class="text-space-note">
    <span class="note-marker" aria-hidden="true">&gt;</span>
    <div class="note-content"><slot /></div>
  </aside>
  <figure v-else-if="info || images.length" class="text-space-figure">
    <figcaption v-if="info" class="text-space-caption" v-html="info" />
    <div v-if="images.length" class="text-space-media">
      <page-image v-if="images.length > 1 && type !== 'flat'" :img="images.join(',')" :alt="info" />
      <template v-else>
        <a
          v-for="image in images"
          :key="image"
          :href="imageUrl(image)"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看原图"
        >
          <img :src="imageUrl(image)" alt="" loading="lazy" decoding="async" />
        </a>
      </template>
    </div>
  </figure>
</template>

<style lang="scss" scoped>
.text-space-note,
.text-space-figure {
  min-width: 0;
  margin: 1.5rem 0;
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  text-align: left;
  text-transform: none;
}

.text-space-note {
  display: grid;
  grid-template-columns: 1ch minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-left: 1px solid var(--article-border, #d4d4d4);
  background: var(--article-surface, transparent);
  font-size: 0.875rem;
  line-height: 1.8;
}

.note-marker {
  color: var(--article-accent, #007f73);
}

.note-content {
  min-width: 0;
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  :deep(> * + *) {
    margin-top: 0.75rem;
  }
}

.text-space-figure {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas: "caption media";
  align-items: start;
  gap: 1.25rem;

  &:not(:has(.text-space-caption)) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "media";
  }

  &:not(:has(.text-space-media)) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "caption";
  }
}

.text-space-caption {
  grid-area: caption;
  min-width: 0;
  padding-top: 0.5rem;
  border-top: 1px solid var(--article-soft-border, #e8e8e8);
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
  line-height: 1.8;
  overflow-wrap: anywhere;

  :deep(b),
  :deep(strong) {
    color: var(--article-strong, #242424);
  }

  :deep(a) {
    color: inherit;
    text-underline-offset: 0.2em;
  }
}

.text-space-media {
  grid-area: media;
  min-width: 0;

  > a {
    display: block;
  }

  > a + a {
    margin-top: 0.75rem;
  }

  > a > img {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 0;
  }

  :deep(.tips) {
    margin: 0;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--article-border, #d4d4d4);
    background: var(--article-bg, #fff);
    color: var(--article-accent, #007f73);
    font-size: 0.8125rem;
  }

  a:focus-visible {
    outline: 1px solid var(--article-accent, #007f73);
    outline-offset: 4px;
  }
}

.dark-mode {
  .text-space-note,
  .text-space-figure {
    color: var(--article-text, #b3b3b3);
  }

  .text-space-note {
    border-color: var(--article-border, #363636);
  }

  .note-marker {
    color: var(--article-accent, #38e7cd);
  }

  .text-space-caption {
    border-color: var(--article-soft-border, #222);
    color: var(--article-muted, #808080);

    :deep(b),
    :deep(strong) {
      color: var(--article-strong, #ededed);
    }
  }

  .text-space-media > a > img {
    opacity: 0.7;
  }

  .text-space-media :deep(.tips) {
    border-color: var(--article-border, #363636);
    background: var(--article-bg, #000);
    color: var(--article-accent, #38e7cd);
  }
}

@media (max-width: 1024px) {
  .text-space-figure {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "media" "caption";
    gap: 0.875rem;
  }
}

@media (max-width: 640px) {
  .text-space-note {
    gap: 0.625rem;
    padding: 0.75rem;
  }
}
</style>
