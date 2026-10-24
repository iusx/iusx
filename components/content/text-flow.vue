<script setup lang="ts">
import { computed } from "vue";
import { parseFlowText } from "~/utils/content-flow";

const props = withDefaults(defineProps<{
  title?: string;
  text?: string;
  file?: string;
  height?: string | number;
}>(), { title: "流程图", text: "", file: "", height: 520 });

const source = computed(() => {
  if (props.file.trim()) return { graph: null, error: "" };
  try { return { graph: parseFlowText(props.text), error: "" }; }
  catch (error) { return { graph: null, error: error instanceof Error ? error.message : "无法解析流程图文字。" }; }
});
</script>

<template>
  <section class="text-flow" :aria-label="title">
    <ContentFlowFile v-if="file.trim()" :key="file" :file="file" :title="title" :height="height" />
    <ContentFlowCanvas v-else-if="source.graph" :graph="source.graph" :title="title" :height="height" />
    <p v-else class="flow-source-error" role="alert">{{ source.error }}</p>
  </section>
</template>

<style scoped>
.text-flow {
  --flow-bg: var(--article-bg, #fff);
  --flow-text: var(--article-text, #4a4a4a);
  --flow-strong: var(--article-strong, #242424);
  --flow-muted: var(--article-muted, #737373);
  --flow-border: var(--article-border, #d4d4d4);
  --flow-soft: var(--article-soft-border, #e8e8e8);
  --flow-accent: var(--article-accent, #007f73);
  --flow-origin: #526d82;
  --flow-goal: var(--flow-accent);
  --flow-intent: #7463a4;
  --flow-finding: #ad5b64;
  --flow-fact: #8a682f;
  --flow-digest: #52764d;
  --flow-note: var(--flow-muted);
  min-width: 0;
  margin: 1.75rem 0;
  color: var(--flow-text);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.875rem;
  line-height: 1.7;
  text-align: left;
  text-transform: none;
}
.dark-mode .text-flow {
  --flow-bg: var(--article-bg, #000);
  --flow-text: var(--article-text, #b3b3b3);
  --flow-strong: var(--article-strong, #ededed);
  --flow-muted: var(--article-muted, #808080);
  --flow-border: var(--article-border, #363636);
  --flow-soft: var(--article-soft-border, #222);
  --flow-accent: var(--article-accent, #38e7cd);
  --flow-origin: #8cabbf;
  --flow-intent: #a8a2ef;
  --flow-finding: #e79b9c;
  --flow-fact: #d9b77b;
  --flow-digest: #99c79a;
}
.flow-source-error { margin: 0; padding: 1rem; border: 1px dashed var(--flow-border); color: var(--flow-muted); overflow-wrap: anywhere; }
</style>
