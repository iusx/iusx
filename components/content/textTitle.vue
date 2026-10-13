<script setup>
import { computed, inject, unref } from "vue";

const props = defineProps({
  t: {
    type: String,
    default: "",
  },
  type: {
    type: [String, Number],
    default: 1,
  },
  id: {
    type: String,
    default: "",
  },
});

const bookTitle = inject("bookTitle", null);
const isSubheading = computed(() => Number(props.type) === 2);
const isBookTitle = computed(
  () => props.t.trim() !== "" && props.t.trim() === unref(bookTitle)?.trim(),
);
const headingId = computed(() => {
  if (props.id) return props.id;

  return props.t
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || undefined;
});
</script>

<template>
  <component
    :is="isBookTitle ? 'h1' : isSubheading ? 'h3' : 'h2'"
    :id="headingId"
    class="text-title"
    :class="{ 'text-title-subheading': isSubheading }"
    :data-toc-exclude="isBookTitle ? '' : undefined"
  >
    <span class="heading-marker" aria-hidden="true">{{ isBookTitle ? '>' : isSubheading ? '##' : '#' }}</span>
    <span>{{ t }}</span>
  </component>
</template>

<style lang="scss" scoped>
.text-title {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  margin: 2.5rem 0 1rem;
  font-family: var(--article-font, monospace);
  color: var(--article-strong, #242424);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 0;
  scroll-margin-top: 5rem;
  overflow-wrap: anywhere;

  &:first-child {
    margin-top: 0;
  }
  > span:last-child { min-width: 0; }
  &[data-toc-exclude] {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--article-border, #d4d4d4);
    font-size: clamp(1.25rem, 2vw, 1.625rem);
  }
}

.heading-marker {
  flex-shrink: 0;
  color: var(--article-muted, #737373);
  font-size: 0.875em;
  font-weight: 400;
}

[data-toc-exclude] .heading-marker { color: var(--article-accent, #007f73); }
.text-title-subheading { font-size: 1rem; }
.dark-mode .text-title { color: var(--article-strong, #ededed); }
.dark-mode .heading-marker { color: var(--article-muted, #808080); }
.dark-mode [data-toc-exclude] .heading-marker { color: var(--article-accent, #38e7cd); }

@media (max-width: 640px) {
  .text-title { gap: 0.5rem; }
}
</style>
