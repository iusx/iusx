<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

defineProps({
  url: {
    type: String,
    required: true,
  },
});

let redirectTimer: ReturnType<typeof setTimeout>;

onMounted(() => {
  redirectTimer = setTimeout(() => {
    window.location.href = "/";
  }, 1000);
});

onBeforeUnmount(() => clearTimeout(redirectTimer));
</script>

<template>
  <div class="article-redirect" role="status">
    <span class="article-redirect-marker" aria-hidden="true">→</span>
    <a href="/">返回首页...</a>
  </div>
</template>

<style lang="scss" scoped>
.article-redirect {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  width: fit-content;
  max-width: 100%;
  margin: 1.5rem 0;
  padding: 0.875rem 1rem;
  border: 1px solid var(--article-border, #d4d4d4);
  border-radius: 0;
  color: var(--article-muted, #737373);
  font-family: var(--article-font, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  font-size: 0.875rem;
  line-height: 1.6;
  text-transform: none;

  a {
    min-width: 0;
    color: inherit;
    text-decoration: none;
    overflow-wrap: anywhere;

    &:hover {
      color: var(--article-strong, #242424);
    }

    &:focus-visible {
      outline: 1px solid var(--article-accent, #007f73);
      outline-offset: 4px;
    }
  }
}

.article-redirect-marker {
  color: var(--article-accent, #007f73);
}

.dark-mode {
  .article-redirect {
    border-color: var(--article-border, #363636);
    color: var(--article-muted, #808080);

    a:hover {
      color: var(--article-strong, #ededed);
    }
  }

  .article-redirect-marker {
    color: var(--article-accent, #38e7cd);
  }
}
</style>
