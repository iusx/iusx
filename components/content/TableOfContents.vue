<script setup lang="ts">
import { defineComponent, h, inject, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from "vue";
import type { PropType, Ref, VNode } from "vue";

interface TocHeading {
  id: string;
  text: string;
  level: number;
  count: number | null;
  children: TocHeading[];
}

const props = defineProps<{ contentElement?: HTMLElement | null }>();
const injectedContentElement = inject<Ref<HTMLElement | null> | null>("bookContentElement", null);
const emit = defineEmits<{ navigate: [id: string] }>();
const navigation = ref<HTMLElement | null>(null);
const headings = shallowRef<TocHeading[]>([]);
const ready = ref(false);
const currentHash = ref("");
const headingSelector = "h1, h2, h3, h4, h5, h6";
const generatedIds = new WeakMap<HTMLElement, { id: string; base: string; text: string }>();
const observerOptions: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["id", "data-toc-exclude", "data-toc-marker", "data-toc-count"],
};

let content: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let pendingFrame: number | null = null;
let mounted = false;

// A recursive list keeps heading levels meaningful, including skipped levels.
const TocList = defineComponent({
  name: "TocList",
  props: {
    items: { type: Array as PropType<TocHeading[]>, required: true },
    currentHash: { type: String, default: "" },
  },
  emits: ["navigate"],
  setup(listProps, { emit: listEmit }): () => VNode {
    return () => h("ul", { class: "toc-list" }, listProps.items.map((heading) =>
      h("li", { key: heading.id }, [
        h("div", { class: "toc-row" }, [
          h("a", {
            href: `#${encodeURIComponent(heading.id)}`,
            "aria-current": listProps.currentHash === heading.id ? "location" : undefined,
            onClick: () => listEmit("navigate", heading.id),
          }, heading.text),
          heading.count === null ? null : h("span", {
            class: "toc-count",
            "aria-label": `${heading.count} 则摘录`,
          }, String(heading.count)),
        ]),
        heading.children.length ? h(TocList, {
          items: heading.children,
          currentHash: listProps.currentHash,
          onNavigate: (id: string) => listEmit("navigate", id),
        }) : null,
      ])
    ));
  },
});

const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim();

const headingText = (heading: HTMLElement) => {
  const label = heading.cloneNode(true) as HTMLElement;
  label.querySelectorAll('[aria-hidden="true"]').forEach(element => element.remove());
  const text = normalizeText(label.textContent || "");
  return heading.hasAttribute("data-toc-marker") ? text.replace(/\s+\d+$/, "") : text;
};

const createId = (text: string) => text.toLowerCase()
  .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^(\d)/, "_$1") || "section";

function refreshHeadings() {
  if (!content) return;

  // Disconnect while supplying missing IDs so our own attributes do not queue a scan.
  observer?.disconnect();
  const elements = Array.from(content.querySelectorAll<HTMLElement>(headingSelector));
  const duplicateTitles = new Set<Element>();
  for (const marker of elements.filter((element) => element.hasAttribute("data-toc-marker"))) {
    for (const sibling of [marker.previousElementSibling, marker.nextElementSibling]) {
      if (sibling?.matches(".text-title")) {
        duplicateTitles.add(sibling);
      }
    }
  }

  const ids = new Set<string>();
  const roots: TocHeading[] = [];
  const parents: TocHeading[] = [];
  for (const element of elements) {
    const text = headingText(element);
    if (!text || duplicateTitles.has(element) || element.closest("[data-toc-exclude]")) continue;

    const originalId = element.id;
    const generated = generatedIds.get(element);
    const baseId = generated?.id === originalId
      ? generated.text === text ? generated.base : createId(text)
      : originalId || createId(text);
    let id = baseId;
    let suffix = 1;
    while (ids.has(id)) id = `${baseId}-${suffix++}`;
    ids.add(id);
    if (id !== originalId) {
      element.id = id;
    }
    if (id !== originalId || generated?.id === originalId) generatedIds.set(element, { id, base: baseId, text });

    const countAttribute = element.getAttribute("data-toc-count");
    const count = countAttribute === null ? null : Number(countAttribute);
    const heading: TocHeading = {
      id,
      text,
      level: Number(element.tagName.slice(1)),
      count: count !== null && Number.isSafeInteger(count) && count >= 0 ? count : null,
      children: [],
    };

    while (parents.length && parents[parents.length - 1].level >= heading.level) parents.pop();
    if (parents.length) parents[parents.length - 1].children.push(heading);
    else roots.push(heading);
    parents.push(heading);
  }

  headings.value = roots;
  ready.value = true;
  observer?.observe(content, observerOptions);
}

function affectsHeadings(mutation: MutationRecord) {
  const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
  if (target?.closest(headingSelector)) return true;
  if (mutation.type === "attributes") return mutation.attributeName === "data-toc-exclude";
  if (mutation.type !== "childList") return false;
  return [...mutation.addedNodes, ...mutation.removedNodes].some((node) =>
    node instanceof Element && (node.matches(headingSelector) || Boolean(node.querySelector(headingSelector)))
  );
}

function bindContent() {
  const nextContent = props.contentElement || unref(injectedContentElement)
    || navigation.value?.closest(".book-layout, .layout")?.querySelector<HTMLElement>(".markdown-content")
    || null;
  if (content === nextContent && ready.value) return;

  observer?.disconnect();
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
  pendingFrame = null;
  content = nextContent;
  if (!content) {
    headings.value = [];
    ready.value = true;
    return;
  }

  observer = new MutationObserver((mutations) => {
    if (pendingFrame !== null || !mutations.some(affectsHeadings)) return;
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = null;
      refreshHeadings();
    });
  });
  refreshHeadings();
}

function updateHash() {
  try {
    currentHash.value = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    currentHash.value = window.location.hash.slice(1);
  }
}

watch(() => props.contentElement || unref(injectedContentElement), () => {
  if (mounted) bindContent();
}, { flush: "post" });

onMounted(() => {
  mounted = true;
  bindContent();
  updateHash();
  window.addEventListener("hashchange", updateHash);
});

onBeforeUnmount(() => {
  mounted = false;
  observer?.disconnect();
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
  window.removeEventListener("hashchange", updateHash);
});
</script>

<template>
  <nav ref="navigation" class="table-of-contents" aria-label="文章目录" :aria-busy="!ready">
    <TocList v-if="headings.length" :items="headings" :current-hash="currentHash" @navigate="emit('navigate', $event)" />
    <p v-else class="toc-empty">{{ ready ? "暂无目录" : "目录加载中…" }}</p>
  </nav>
</template>

<style lang="scss" scoped>
.table-of-contents {
  --toc-color: var(--article-text, #4a4a4a);
  --toc-muted: var(--article-muted, #737373);
  --toc-line: var(--article-soft-border, #e8e8e8);
  --toc-accent: var(--article-accent, #007f73);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.8125rem;

  :deep(.toc-list) {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  :deep(.toc-list .toc-list) {
    margin-left: 0.7rem;
    padding-left: 0.875rem;
    border-left: 1px solid var(--toc-line);
  }

  :deep(.toc-row) {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin: 0.375rem 0;
  }

  :deep(a) {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.125rem 0;
    color: var(--toc-color);
    font-family: inherit;
    line-height: 1.65;
    text-decoration: none;
    overflow-wrap: anywhere;

    &::before {
      content: "[ ]";
      color: var(--toc-muted);
      font-size: 0.75rem;
      white-space: pre;
      flex-shrink: 0;
    }

    &:hover,
    &[aria-current="location"] {
      color: var(--toc-accent);
    }

    &[aria-current="location"]::before { content: "[>]"; color: var(--toc-accent); }

    &:focus-visible {
      outline: 1px solid var(--toc-accent);
      outline-offset: 3px;
    }
  }

  :deep(.toc-count) {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--toc-muted);
    font-size: 0.6875rem;
    font-variant-numeric: tabular-nums;
    &::before { content: "["; }
    &::after { content: "]"; }
  }
}
.toc-empty {
  margin: 0.625rem 0;
  color: var(--toc-muted);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.65;
}
.dark-mode .table-of-contents {
  --toc-color: var(--article-text, #b3b3b3);
  --toc-muted: var(--article-muted, #808080);
  --toc-line: var(--article-soft-border, #222);
  --toc-accent: var(--article-accent, #38e7cd);
}
</style>
