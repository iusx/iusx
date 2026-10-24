<script setup lang="ts">
import { useAsyncData, useRequestURL } from "#imports";
import { parseFlowText, readFlowFile } from "~/utils/content-flow";

const props = defineProps<{ file: string; title: string; height: string | number }>();
const requestURL = useRequestURL();
const { data: graph, status, error, refresh } = useAsyncData(
  `content-flow:${props.file}`,
  async () => {
    const path = props.file.trim().replace(/^\/?public\//, "/");
    const local = path.startsWith("/") ? path : `/${path}`;
    if (!/^\/(?!\/)[^?#\\:]+\.(?:json|txt|mmd)(?:\?[^#]*)?$/i.test(local) || local.split(/[/?]/).includes("..")) {
      throw new Error("file 请使用 public 目录中的 .json、.txt 或 .mmd 路径。");
    }
    const url = import.meta.dev && import.meta.server ? new URL(local, requestURL.origin).href : local;
    const source = await $fetch<string>(url, { responseType: "text", retry: 0 });
    if (!/\.json(?:\?|$)/i.test(local)) return parseFlowText(source);
    let input: unknown;
    try { input = JSON.parse(source); } catch { throw new Error("JSON 格式无效，请检查文件内容。"); }
    return readFlowFile(input);
  },
  { deep: false },
);
</script>

<template>
  <ContentFlowCanvas v-if="graph && !error" :graph="graph" :title="title" :height="height" />
  <div v-else class="flow-file-state" role="status" :aria-busy="status === 'pending'">
    <template v-if="error">
      <span>流程图读取失败。{{ error.statusCode === 404 ? '文件不存在，请检查路径。' : error.message }}</span>
      <button type="button" @click="refresh()">重新加载</button>
    </template>
    <span v-else>正在读取流程图…</span>
  </div>
</template>

<style scoped>
.flow-file-state { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem 1rem; padding: 1rem; border: 1px solid var(--flow-border); color: var(--flow-muted); font-size: 0.75rem; overflow-wrap: anywhere; }
.flow-file-state button { flex: none; padding: 0; border: 0; background: transparent; color: var(--flow-accent); font: inherit; text-decoration: underline; text-underline-offset: 0.2em; cursor: pointer; }
.flow-file-state button:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
</style>
