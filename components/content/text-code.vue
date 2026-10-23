<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useId } from "#imports";
import { displayText } from "~/utils/display-text";

const props = withDefaults(defineProps<{
  title?: string;
  files?: string | string[];
  active?: string | number;
}>(), { title: "代码块", files: "", active: 0 });

const id = useId();
const files = computed(() => {
  const value = props.files;
  const list = Array.isArray(value) ? value : String(value ?? "").split(/[,\n]/);
  return list.map(file => displayText(file).trim()).filter(Boolean);
});
type CodeFile = { type: "file"; path: string; name: string; index: number; depth: number };
type CodeFolder = { type: "folder"; path: string; name: string; index: number; depth: number; children: CodeEntry[] };
type CodeEntry = CodeFile | CodeFolder;
const entries = computed(() => {
  const root: CodeEntry[] = [];
  const folders = new Map<string, CodeFolder>();
  for (const [fileIndex, value] of files.value.entries()) {
    const path = value.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    const parts = path.split("/").filter(Boolean);
    const name = parts.pop() ?? path;
    let children = root;
    let folderPath = "";
    for (const [depth, part] of parts.entries()) {
      folderPath += `/${part}`;
      let folder = folders.get(folderPath);
      if (!folder) {
        folder = { type: "folder", path: folderPath, name: part, index: fileIndex, depth, children: [] };
        folders.set(folderPath, folder);
        children.push(folder);
      }
      children = folder.children;
    }
    children.push({ type: "file", path, name, index: fileIndex, depth: parts.length });
  }
  const flatten = (list: CodeEntry[]): CodeEntry[] => list.flatMap(entry =>
    entry.type === "folder" ? [entry, ...flatten(entry.children)] : [entry]);
  return flatten(root);
});
const clamp = (value: number) => files.value.length ? Math.max(0, Math.min(Math.trunc(value), files.value.length - 1)) : 0;
const resolveActive = (): number => {
  const value = props.active;
  if (typeof value === "number") return clamp(value);
  const text = String(value ?? "").trim();
  if (/^\d+$/.test(text)) return clamp(Number(text));
  const match = files.value.findIndex(file => file === text);
  return match >= 0 ? match : 0;
};
const activeIndex = ref(resolveActive());
const activeFile = computed(() => files.value[activeIndex.value] ?? "");
const visibilityCss = computed(() => files.value.map((_, index) =>
  `#${id}-code[data-active-index="${index}"] > *:not(:nth-child(${index + 1})){display:none}`,
).join("\n"));

function select(index: number) {
  activeIndex.value = clamp(index);
}
function handleTabKey(event: KeyboardEvent, index: number) {
  const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  if (!Object.prototype.hasOwnProperty.call(keys, event.key) || !files.value.length) return;
  event.preventDefault();
  const next = (index + keys[event.key] + files.value.length) % files.value.length;
  activeIndex.value = next;
  void nextTick(() => document.getElementById(`${id}-tab-${next}`)?.focus());
}

watch([files, () => props.active], () => { activeIndex.value = resolveActive(); });
</script>

<template>
  <figure class="text-code" :aria-label="title">
    <component v-if="files.length" is="style">{{ visibilityCss }}</component>
    <header class="code-heading">
      <span class="code-heading-title"><span aria-hidden="true">&gt;</span> {{ displayText(title) }}</span>
      <span class="code-count">{{ files.length }} 文件</span>
    </header>
    <div class="code-layout" :class="{ 'is-single': files.length <= 1 }">
      <nav v-if="files.length" class="code-tree" role="tablist" aria-label="代码文件">
        <template v-for="entry in entries" :key="entry.type === 'folder' ? `folder-${entry.path}` : `file-${entry.index}`">
          <div
            v-if="entry.type === 'folder'"
            class="code-folder-name"
            :style="{ paddingLeft: `${0.5 + entry.depth * 0.9}rem` }"
          >{{ entry.name }}/</div>
          <button
            v-else
            type="button"
            role="tab"
            class="code-file"
            :class="{ 'is-active': activeIndex === entry.index }"
            :id="`${id}-tab-${entry.index}`"
            :data-file-index="entry.index"
            :aria-selected="activeIndex === entry.index"
            :aria-controls="`${id}-code`"
            :tabindex="activeIndex === entry.index ? 0 : -1"
            :title="entry.path"
            :style="{ paddingLeft: `${0.5 + entry.depth * 0.9}rem` }"
            @click="select(entry.index)"
            @keydown="handleTabKey($event, entry.index)"
          >
            <span aria-hidden="true">·</span>{{ entry.name }}
          </button>
        </template>
      </nav>
      <div
        :id="`${id}-code`"
        class="code-body"
        role="tabpanel"
        :aria-labelledby="files.length ? `${id}-tab-${activeIndex}` : undefined"
        :data-active-index="files.length ? activeIndex : undefined"
        :data-file="activeFile"
      >
        <slot />
      </div>
    </div>
  </figure>
</template>

<style scoped>
.text-code {
  --code-bg: var(--article-bg, #fff);
  --code-text: var(--article-text, #4a4a4a);
  --code-strong: var(--article-strong, #242424);
  --code-muted: var(--article-muted, #737373);
  --code-border: var(--article-border, #d4d4d4);
  --code-soft: var(--article-soft-border, #e8e8e8);
  --code-accent: var(--article-accent, #007f73);
  min-width: 0;
  margin: 1.75rem 0;
  border: 1px solid var(--code-border);
  color: var(--code-text);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
  text-align: left;
}
.dark-mode .text-code {
  --code-bg: var(--article-bg, #000);
  --code-text: var(--article-text, #b3b3b3);
  --code-strong: var(--article-strong, #ededed);
  --code-muted: var(--article-muted, #808080);
  --code-border: var(--article-border, #363636);
  --code-soft: var(--article-soft-border, #222);
  --code-accent: var(--article-accent, #38e7cd);
}
.code-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.375rem 1rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--code-border);
  color: var(--code-muted);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.code-heading-title { color: var(--code-strong); }
.code-heading-title > span { color: var(--code-accent); }
.code-count { font-size: 0.6875rem; font-variant-numeric: tabular-nums; }
.code-layout { display: grid; grid-template-columns: minmax(9rem, 13rem) minmax(0, 1fr); }
.code-layout.is-single { grid-template-columns: minmax(0, 1fr); }
.code-tree {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  padding: 0.625rem 0.5rem;
  border-right: 1px solid var(--code-soft);
  overflow: auto;
}
.code-folder-name {
  padding: 0.25rem 0.5rem;
  color: var(--code-muted);
  font-size: 0.6875rem;
  overflow-wrap: anywhere;
}
.code-folder-name:not(:first-child) { margin-top: 0.5rem; }
.code-file {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0.375rem 0.5rem;
  border: 0;
  background: transparent;
  color: var(--code-text);
  font: inherit;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: left;
  cursor: pointer;
  overflow-wrap: anywhere;
}
.code-file > span { color: var(--code-muted); }
.code-file:hover { color: var(--code-accent); }
.code-file.is-active {
  color: var(--code-accent);
  box-shadow: inset 2px 0 0 var(--code-accent);
}
.code-file.is-active > span { color: var(--code-accent); }
.code-file:focus-visible { outline: 1px solid var(--code-accent); outline-offset: -2px; }
.code-body { min-width: 0; overflow: hidden; }
.code-body :deep(> *) { margin-top: 0 !important; margin-bottom: 0 !important; }
.code-body :deep(pre) { margin: 0 !important; padding: 1rem !important; overflow-x: auto; }
.code-body :deep(code) { font-family: inherit; font-size: 0.8125rem; }
@media (max-width: 640px) {
  .code-layout { grid-template-columns: minmax(0, 1fr); }
  .code-tree {
    max-height: 15rem;
    padding: 0.5rem;
    border-right: 0;
    border-bottom: 1px solid var(--code-soft);
    overflow: auto;
  }
}
</style>
