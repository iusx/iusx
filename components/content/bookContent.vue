<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, unref, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { activateArticleSection } from "~/utils/article-activation";

const props = defineProps({
  title: { type: String, default: "" },
  img: { type: String, default: "" },
  by: { type: String, default: "" },
  plan: { type: String, default: "" },
});
provide("bookTitle", computed(() => props.title));

const titleParts = computed(() => {
  const separatorIndex = props.title.indexOf(":");
  return separatorIndex < 0
    ? { first: props.title, second: "" }
    : {
        first: props.title.slice(0, separatorIndex + 1).trim(),
        second: props.title.slice(separatorIndex + 1).trim(),
      };
});
const coverSrc = computed(() => {
  if (!props.img) return "";
  return /^(https?:\/\/|\/)/.test(props.img) ? props.img : `/img/book/${props.img}`;
});
const coverFailed = ref(false);
const coverElement = ref(null);
watch(coverSrc, () => { coverFailed.value = false; });
onNuxtReady(() => {
  // The browser may finish (or fail) an SSR image before Vue attaches its listeners.
  const image = coverElement.value;
  if (image?.complete && !image.naturalWidth) coverFailed.value = true;
});

const percentage = computed(() => {
  const values = props.plan.split(",");
  if (values.length !== 2 || values.some(value => !value.trim())) return null;
  const [current, total] = values.map(Number);
  if (!Number.isFinite(current) || !Number.isFinite(total) || current < 0 || total <= 0) return null;
  return Math.round(Math.min(current / total, 1) * 100);
});

const contentElement = ref(null);
provide("bookContentElement", contentElement);
const sidebarElement = ref(null);
const menuButton = ref(null);
const isMobile = useMediaQuery("(max-width: 1024px)");
const isDrawerOpen = ref(false);
const smoothScroller = inject("smoothScroller", null);
const introBlocking = inject("introBlocking", ref(false));
let stopEntryHashWatcher;
let disposed = false;
let pausedScroller = null;
watch(() => isDrawerOpen.value ? unref(smoothScroller) : null, scroller => {
  pausedScroller?.start();
  pausedScroller = scroller;
  pausedScroller?.stop();
}, { flush: "sync" });
let restoreScroll = () => {};
let restoreFocus = true;
const closeDrawer = () => { restoreFocus = true; isDrawerOpen.value = false; };
const navigateToHeading = async id => {
  restoreFocus = false;
  isDrawerOpen.value = false;
  await nextTick();
  let heading = contentElement.value?.querySelector(`#${CSS.escape(id)}`);
  await activateArticleSection(heading);
  heading = contentElement.value?.querySelector(`#${CSS.escape(id)}`);
  if (heading?.hasAttribute("data-toc-marker")) {
    heading = [heading.previousElementSibling, heading.nextElementSibling]
      .find(element => element?.matches(".text-title")) || heading;
  }
  if (heading) {
    heading.scrollIntoView({ block: "start" });
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
};
watch(isMobile, mobile => { if (!mobile) closeDrawer(); });

onNuxtReady(() => {
  if (disposed || !window.location.hash) return;
  // A direct hash entry may precede both the intro unlocking the page and the
  // lazy section activating. Align/focus the live heading once both are ready.
  stopEntryHashWatcher = watch(() => unref(introBlocking), blocked => {
    if (blocked) return;
    void nextTick().then(() => {
      stopEntryHashWatcher?.();
      if (disposed) return;
      let id = window.location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Preserve malformed hashes verbatim. */ }
      if (id) void navigateToHeading(id);
    });
  }, { immediate: true, flush: "post" });
});

onMounted(() => {
  // Viewport changes must not rerender Markdown while its async components
  // are still hydrating. Keep viewport-only attributes out of the template.
  watch([isMobile, isDrawerOpen], ([mobile, open]) => {
    const sidebar = sidebarElement.value;
    if (!sidebar) return;
    sidebar.inert = mobile && !open;
    if (mobile) sidebar.setAttribute("role", "dialog");
    else sidebar.removeAttribute("role");
    if (sidebar.inert) sidebar.setAttribute("aria-hidden", "true");
    else sidebar.removeAttribute("aria-hidden");
  }, { immediate: true, flush: "post" });
  watch(isDrawerOpen, async open => {
    if (open) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      restoreScroll = () => { document.body.style.overflow = previousOverflow; };
      await nextTick();
      if (isDrawerOpen.value && isMobile.value) sidebarElement.value?.focus({ preventScroll: true });
    } else {
      restoreScroll();
      restoreScroll = () => {};
      if (restoreFocus && isMobile.value) menuButton.value?.focus({ preventScroll: true });
    }
  }, { flush: "post" });
});
onBeforeUnmount(() => {
  disposed = true;
  stopEntryHashWatcher?.();
  restoreScroll();
  pausedScroller?.start();
});

const handleSidebarKeydown = event => {
  if (!isDrawerOpen.value) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDrawer();
  } else if (event.key === "Tab") {
    const focusable = sidebarElement.value?.querySelectorAll("a[href], button:not([disabled])");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sidebarElement.value)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === sidebarElement.value)) {
      event.preventDefault();
      first.focus();
    }
  }
};
</script>

<template>
  <div class="book-page">
    <div class="reading-progress" aria-hidden="true"></div>
    <button ref="menuButton" class="directory-toggle" type="button" aria-controls="book-details"
      :aria-expanded="isDrawerOpen" @click="isDrawerOpen = true">目录</button>
    <Transition name="directory-backdrop">
      <div v-if="isDrawerOpen" class="directory-backdrop" @click="closeDrawer"></div>
    </Transition>
    <main class="book-layout">
      <aside id="book-details" ref="sidebarElement" class="book-info" :class="{ 'is-open': isDrawerOpen }"
        :aria-modal="isDrawerOpen ? 'true' : undefined" aria-label="书籍信息与目录"
        tabindex="-1" data-lenis-prevent @keydown="handleSidebarKeydown">
        <button class="directory-close" type="button" aria-label="关闭目录" @click="closeDrawer">CLOSE ×</button>
        <NuxtLink class="library-link" to="/book" @click="closeDrawer">← LIBRARY</NuxtLink>
        <div class="book-cover">
          <img v-if="coverSrc && !coverFailed" ref="coverElement" :src="coverSrc" :alt="`${title} 封面`" width="540" height="710"
            decoding="async" @error="coverFailed = true" />
          <span v-else class="cover-fallback">{{ title || "暂无封面" }}</span>
        </div>
        <div class="book-meta">
          <p v-if="by">By {{ by }}</p>
          <span v-if="percentage !== null">{{ percentage === 100 ? 'READ' : 'READING' }} {{ percentage }}%</span>
          <span v-else-if="plan">{{ plan }}</span>
        </div>
        <progress v-if="percentage !== null" class="book-completion" :value="percentage" max="100" aria-label="书籍阅读进度"></progress>
        <div class="book-title">
          <p>{{ titleParts.first }}</p>
          <span v-if="titleParts.second">{{ titleParts.second }}</span>
        </div>
        <div class="dir-layout">
          <p class="directory-label">DIRECTORY</p>
          <TableOfContents @navigate="navigateToHeading" />
        </div>
      </aside>
      <article ref="contentElement" class="main-con text markdown-content" :inert="isDrawerOpen || undefined">
        <slot />
      </article>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.book-page {
  --book-bg: var(--article-bg, #fff);
  --book-text: var(--article-text, #4a4a4a);
  --book-strong: var(--article-strong, #242424);
  --book-muted: var(--article-muted, #737373);
  --book-border: var(--article-border, #d4d4d4);
  --book-soft-border: var(--article-soft-border, #e8e8e8);
  --book-accent: var(--article-accent, #007f73);
  color: var(--book-text);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
}
.dark-mode .book-page {
  --book-bg: var(--article-bg, #000);
  --book-text: var(--article-text, #b3b3b3);
  --book-strong: var(--article-strong, #ededed);
  --book-muted: var(--article-muted, #808080);
  --book-border: var(--article-border, #363636);
  --book-soft-border: var(--article-soft-border, #222);
  --book-accent: var(--article-accent, #38e7cd);
}
.book-layout {
  --sidebar-width: clamp(230px, 25vw, 280px);
  position: relative;
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  align-items: start;
  width: min(1240px, 90%);
  margin: 2.5rem auto 5rem;
  border: 1px solid var(--book-border);
  box-sizing: border-box;
  background: var(--book-bg);
  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 var(--sidebar-width);
    width: 1px;
    background: var(--book-border);
    pointer-events: none;
  }
}
.book-info {
  position: sticky;
  top: 1.5rem;
  max-height: calc(100dvh - 3rem);
  min-width: 0;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--book-border) transparent;

  @supports selector(::-webkit-scrollbar) {
    // Standard scrollbar properties otherwise override the square WebKit styling.
    scrollbar-width: auto;
    scrollbar-color: auto;

    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: transparent; border-radius: 0; }
    &::-webkit-scrollbar-thumb {
      min-height: 40px;
      border: 1px solid var(--book-border);
      border-radius: 0;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb:hover { border-color: var(--book-muted); }
    &::-webkit-scrollbar-thumb:active { background: var(--book-soft-border); }
    &::-webkit-scrollbar-button { display: none; }
  }
}
.library-link {
  display: inline-block;
  margin-bottom: 1.25rem;
  color: var(--book-muted);
  text-decoration: none;
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.5;
  letter-spacing: 0.04em;
  &:hover { color: var(--book-accent); }
}
.book-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 54 / 71;
  max-width: 220px;
  border: 1px solid var(--book-border);
  background: transparent;
  overflow: hidden;
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
}
.cover-fallback { padding: 1.25rem; color: var(--book-muted); text-align: center; line-height: 1.8; }
.book-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  margin: 0.875rem 0 0.625rem;
  color: var(--book-muted);
  font-size: 0.75rem;
  line-height: 1.6;
  p { margin: 0; }
  span { font-variant-numeric: tabular-nums; }
}
.book-completion {
  display: block;
  width: 100%;
  height: 2px;
  border: 0;
  border-radius: 0;
  appearance: none;
  background: var(--book-soft-border);
  color: var(--book-accent);
  &::-webkit-progress-bar { background: var(--book-soft-border); }
  &::-webkit-progress-value { background: var(--book-accent); }
  &::-moz-progress-bar { background: var(--book-accent); }
}
.book-title {
  margin-top: 1.125rem;
  line-height: 1.65;
  overflow-wrap: anywhere;
  p { margin: 0; color: var(--book-strong); font-size: 1.0625rem; font-weight: 600; }
  span { display: block; margin-top: 0.25rem; color: var(--book-muted); font-size: 0.8125rem; }
}
.dir-layout { margin-top: 1.75rem; }
.directory-label {
  margin: 0 0 0.875rem;
  padding: 0 0 0.625rem;
  border-bottom: 1px solid var(--book-border);
  color: var(--book-strong);
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.08em;
  &::before { content: "> "; color: var(--book-muted); }
}
.main-con.markdown-content {
  display: block;
  width: 100%;
  min-width: 0;
  padding: clamp(1.5rem, 3vw, 2.75rem);
  box-sizing: border-box;
  color: var(--book-text);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.85;
  overflow-wrap: anywhere;
  :deep(> p), :deep(> .article-section > p) { color: inherit; font-size: inherit; line-height: inherit; }
  :deep(> p), :deep(> .article-section > p) { margin: 1.25rem 0; }
  :deep(> :first-child) { margin-top: 0; }
  :deep(> .article-section:first-child > :first-child) { margin-top: 0; }
  :deep(:is(h1, h2, h3, h4, h5, h6)) { scroll-margin-top: 2rem; text-transform: none; }
  :deep(> :is(h1, h2, h3, h4, h5, h6):not(.text-title)),
  :deep(> .article-section > :is(h1, h2, h3, h4, h5, h6):not(.text-title)) {
    margin: 2.5rem 0 1rem;
    color: var(--book-strong);
    font-size: 1.1875rem;
    font-weight: 600;
    line-height: 1.6;
  }
  :deep([data-toc-marker]) { height: 0; margin: 0 !important; padding: 0; overflow: hidden; font-size: 0 !important; }
  :deep(img) { display: block; max-width: 100%; height: auto; }
  :deep(pre) { overflow-x: auto; }
}
.library-link,
.directory-toggle,
.directory-close {
  &:focus-visible { outline: 1px solid var(--book-accent); outline-offset: 4px; }
}
.directory-toggle, .directory-close, .directory-backdrop, .reading-progress { display: none; }
.directory-backdrop-enter-active,
.directory-backdrop-leave-active { transition: opacity 0.32s ease; }
.directory-backdrop-enter-from,
.directory-backdrop-leave-to { opacity: 0; }
.directory-backdrop-leave-active { pointer-events: none; }
@supports (animation-timeline: scroll()) {
  .reading-progress {
    display: block;
    position: fixed;
    inset: auto var(--site-menu-width, 0px) var(--site-menu-height, 0px) 0;
    height: 2px;
    z-index: 1002;
    background: var(--book-accent);
    transform-origin: left;
    animation: reading-progress linear;
    animation-timeline: scroll(root block);
  }
}
@keyframes reading-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (max-width: 1024px) {
  .book-layout {
    display: block;
    width: min(800px, 92%);
    margin-top: 4.75rem;
    &::before { display: none; }
  }
  .main-con.markdown-content { padding: 1.5rem; }
  .main-con.markdown-content :deep(:is(h1, h2, h3, h4, h5, h6)) { scroll-margin-top: 5rem; }
  .directory-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 4%;
    z-index: 101;
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--book-border);
    border-radius: 0;
    background: var(--book-bg);
    color: var(--book-text);
    font-family: inherit;
    font-size: 0.8125rem;
    line-height: 1.4;
    cursor: pointer;
    &::before { content: "[+] "; color: var(--book-accent); }
    &:hover { color: var(--book-strong); }
  }
  .directory-backdrop { display: block; position: fixed; inset: 0; z-index: 1000; background: #0008; }
  .book-info {
    display: block;
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1001;
    width: min(360px, 86vw);
    height: 100dvh;
    max-height: none;
    padding: 1.5rem;
    border-right: 1px solid var(--book-border);
    box-sizing: border-box;
    background: var(--book-bg);
    transform: translateX(-100%);
    visibility: hidden;
    pointer-events: none;
    transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s linear 0.32s;
    &.is-open {
      transform: translateX(0);
      visibility: visible;
      pointer-events: auto;
      transition-delay: 0s;
    }
  }
  .directory-close {
    display: block;
    float: right;
    min-height: 32px;
    padding: 0 0.375rem;
    margin: -0.375rem -0.375rem 0 0;
    border: 1px solid var(--book-border);
    border-radius: 0;
    background: transparent;
    color: var(--book-muted);
    font-family: inherit;
    font-size: 0.6875rem;
    line-height: 1.5;
    cursor: pointer;
    &:hover { color: var(--book-strong); border-color: var(--book-muted); }
  }
  .book-cover { max-width: 200px; }
}
@media (max-width: 480px) {
  .main-con.markdown-content { padding: 1.125rem; font-size: 0.9375rem; }
  .book-layout { margin-bottom: 3rem; }
}
@media (prefers-reduced-motion: reduce) {
  .book-info,
  .directory-backdrop-enter-active,
  .directory-backdrop-leave-active { transition: none; }
  .directory-backdrop-enter-from,
  .directory-backdrop-leave-to { opacity: 1; }
}
</style>
