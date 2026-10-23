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
interface HeadingGroup {
  element: HTMLElement;
  headings: { id: string; element: HTMLElement }[];
}

const props = defineProps<{ contentElement?: HTMLElement | null }>();
const injectedContentElement = inject<Ref<HTMLElement | null> | null>("bookContentElement", null);
const emit = defineEmits<{ navigate: [id: string] }>();
const navigation = ref<HTMLElement | null>(null);
const headings = shallowRef<TocHeading[]>([]);
const ready = ref(false);
const activeId = ref("");
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
let resizeObserver: ResizeObserver | null = null;
let pendingFrame: number | null = null;
let activeFrame: number | null = null;
let headingGroups: HeadingGroup[] = [];
let mounted = false;

const containsHeading = (items: TocHeading[], id: string): boolean => items.some(heading =>
  heading.id === id || containsHeading(heading.children, id)
);

// A recursive list keeps heading levels meaningful, including skipped levels.
const TocList = defineComponent({
  name: "TocList",
  props: {
    items: { type: Array as PropType<TocHeading[]>, required: true },
    activeId: { type: String, default: "" },
  },
  emits: ["navigate"],
  setup(listProps, { emit: listEmit }): () => VNode {
    return () => h("ul", { class: "toc-list" }, listProps.items.map((heading) =>
      h("li", { key: heading.id }, [
        h("div", { class: "toc-row" }, [
          h("a", {
            href: `#${encodeURIComponent(heading.id)}`,
            "aria-current": listProps.activeId === heading.id ? "location" : undefined,
            "data-active-ancestor": containsHeading(heading.children, listProps.activeId) ? "" : undefined,
            onClick: (event: MouseEvent) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              // Let the browser record the hash before activating/focusing the
              // live heading; a later default anchor action would steal focus.
              window.location.hash = encodeURIComponent(heading.id);
              listEmit("navigate", heading.id);
            },
          }, heading.text),
          heading.count === null ? null : h("span", {
            class: "toc-count",
            "aria-label": `${heading.count} 则摘录`,
          }, String(heading.count)),
        ]),
        heading.children.length ? h(TocList, {
          items: heading.children,
          activeId: listProps.activeId,
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

function sameHeadings(previous: TocHeading[], next: TocHeading[]): boolean {
  return previous.length === next.length && previous.every((heading, index) => {
    const other = next[index];
    return heading.id === other.id && heading.text === other.text && heading.level === other.level
      && heading.count === other.count && sameHeadings(heading.children, other.children);
  });
}

function refreshHeadings() {
  if (!content) return;

  // Disconnect while supplying missing IDs so our own attributes do not queue a scan.
  observer?.disconnect();
  const elements = Array.from(content.querySelectorAll<HTMLElement>(headingSelector));
  const duplicateTitles = new Set<Element>();
  const visibleTitles = new Map<HTMLElement, HTMLElement>();
  for (const marker of elements.filter((element) => element.hasAttribute("data-toc-marker"))) {
    for (const sibling of [marker.previousElementSibling, marker.nextElementSibling]) {
      if (sibling?.matches(".text-title")) {
        duplicateTitles.add(sibling);
        visibleTitles.set(marker, sibling as HTMLElement);
      }
    }
  }

  const ids = new Set<string>();
  const roots: TocHeading[] = [];
  const parents: TocHeading[] = [];
  const groups: HeadingGroup[] = [];
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
    const positionElement = visibleTitles.get(element) || element;
    const groupElement = positionElement.closest<HTMLElement>(".article-section") || positionElement;
    let group = groups[groups.length - 1];
    if (!group || group.element !== groupElement) {
      group = { element: groupElement, headings: [] };
      groups.push(group);
    }
    group.headings.push({ id, element: positionElement });

    while (parents.length && parents[parents.length - 1].level >= heading.level) parents.pop();
    if (parents.length) parents[parents.length - 1].children.push(heading);
    else roots.push(heading);
    parents.push(heading);
  }

  if (!sameHeadings(headings.value, roots)) headings.value = roots;
  headingGroups = groups;
  ready.value = true;
  observer?.observe(content, observerOptions);
  scheduleActiveHeading();
}

function updateActiveHeading() {
  if (!headingGroups.length) {
    activeId.value = "";
    return;
  }

  const lastGroup = headingGroups[headingGroups.length - 1];
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    activeId.value = lastGroup.headings[lastGroup.headings.length - 1].id;
    return;
  }

  const readingLine = Math.max(80, Math.min(window.innerHeight * 0.3, 320));
  let low = 0;
  let high = headingGroups.length - 1;
  let index = -1;
  // Search section boxes first so distant content-visibility sections keep
  // their deferred layout. Only read individual headings in the current group.
  while (low <= high) {
    const middle = (low + high) >>> 1;
    if (headingGroups[middle].element.getBoundingClientRect().top <= readingLine) {
      index = middle;
      low = middle + 1;
    } else high = middle - 1;
  }

  if (index < 0) {
    activeId.value = headingGroups[0].headings[0].id;
    return;
  }
  const group = headingGroups[index];
  const previous = headingGroups[index - 1]?.headings;
  let id = previous ? previous[previous.length - 1].id : group.headings[0].id;
  if (group.element.getBoundingClientRect().bottom <= readingLine) {
    id = group.headings[group.headings.length - 1].id;
  } else {
    for (const heading of group.headings) {
      if (heading.element.getBoundingClientRect().top > readingLine) break;
      id = heading.id;
    }
  }
  activeId.value = id;
}

function scheduleActiveHeading() {
  if (!mounted || activeFrame !== null) return;
  activeFrame = requestAnimationFrame(() => {
    activeFrame = null;
    updateActiveHeading();
  });
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
  resizeObserver?.disconnect();
  content?.removeEventListener("load", scheduleActiveHeading, true);
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
  if (activeFrame !== null) cancelAnimationFrame(activeFrame);
  pendingFrame = null;
  activeFrame = null;
  headingGroups = [];
  content = nextContent;
  if (!content) {
    headings.value = [];
    activeId.value = "";
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
  content.addEventListener("load", scheduleActiveHeading, true);
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(scheduleActiveHeading);
    resizeObserver.observe(content);
  }
}

function updateHash() {
  let id: string;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    id = window.location.hash.slice(1);
  }
  if (containsHeading(headings.value, id)) activeId.value = id;
  scheduleActiveHeading();
}

function navigate(id: string) {
  activeId.value = id;
  emit("navigate", id);
  scheduleActiveHeading();
}

watch(() => props.contentElement || unref(injectedContentElement), () => {
  if (mounted) bindContent();
}, { flush: "post" });

onMounted(() => {
  mounted = true;
  bindContent();
  updateHash();
  window.addEventListener("hashchange", updateHash);
  window.addEventListener("scroll", scheduleActiveHeading, { passive: true });
  window.addEventListener("resize", scheduleActiveHeading);
});

onBeforeUnmount(() => {
  mounted = false;
  observer?.disconnect();
  resizeObserver?.disconnect();
  content?.removeEventListener("load", scheduleActiveHeading, true);
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
  if (activeFrame !== null) cancelAnimationFrame(activeFrame);
  window.removeEventListener("hashchange", updateHash);
  window.removeEventListener("scroll", scheduleActiveHeading);
  window.removeEventListener("resize", scheduleActiveHeading);
});
</script>

<template>
  <nav ref="navigation" class="table-of-contents" aria-label="文章目录" :aria-busy="!ready">
    <TocList v-if="headings.length" :items="headings" :active-id="activeId" @navigate="navigate" />
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
    &[data-active-ancestor],
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
