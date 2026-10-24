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
  --heading-space-before: 3.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  margin: var(--heading-space-before) 0 1.25rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--article-soft-border, #e8e8e8);
  font-family: var(--article-font, monospace);
  color: var(--article-strong, #242424);
  font-size: var(--article-chapter-size, clamp(1.25rem, 1.6vw, 1.5rem));
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
  color: var(--article-accent, #007f73);
  font-size: 0.875em;
  font-weight: 400;
}

.text-title-subheading {
  --heading-space-before: 2.25rem;
  margin-bottom: 0.875rem;
  padding-bottom: 0;
  border-bottom: 0;
  font-size: var(--article-subheading-size, 1.0625rem);
}
.text-title-subheading .heading-marker { color: var(--article-muted, #737373); }
.dark-mode .text-title { color: var(--article-strong, #ededed); }
.dark-mode .heading-marker { color: var(--article-accent, #38e7cd); }
.dark-mode .text-title-subheading .heading-marker { color: var(--article-muted, #808080); }

@media (max-width: 640px) {
  .text-title { gap: 0.5rem; }
}
</style>
