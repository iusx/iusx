<script lang="ts">
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useNuxtApp } from "#imports";
import { registerArticleSection } from "~/utils/article-activation";

export default defineComponent({
  name: "LazyArticleSection",
  props: {
    id: { type: String, required: true },
    eager: { type: Boolean, default: false },
    estimatedHeight: { type: Number, default: 1600 },
  },
  setup(props, { slots }) {
    const element = ref<HTMLElement | null>(null);
    // Keep the server's own HTML in place, including headings and highlighted
    // code. Vue 3.4 can skip child hydration with innerHTML; evaluating this
    // slot eagerly would recreate thousands of VNodes before the first scroll.
    // Never use external/user-provided HTML here: this is our rendered DOM.
    let html = import.meta.client && !props.eager && useNuxtApp().isHydrating
      ? document.getElementById(props.id)?.innerHTML
      : undefined;
    const active = ref(html === undefined);
    let unregister: (() => void) | undefined;
    let disposed = false;
    let activation: Promise<void> | undefined;

    function elementPath(target: Element | null) {
      const path: number[] = [];
      let current = target;
      while (current && current !== element.value) {
        const parent = current.parentElement;
        if (!parent) return null;
        path.unshift(Array.prototype.indexOf.call(parent.children, current));
        current = parent;
      }
      return current === element.value ? path : null;
    }
    function findElement(path: number[] | null): HTMLElement | null {
      let current: Element | null = element.value;
      for (const index of path || []) current = current?.children[index] || null;
      return path && current instanceof HTMLElement ? current : null;
    }

    function activate(): Promise<void> {
      if (activation) return activation;
      if (active.value || disposed) return Promise.resolve();
      const focused = elementPath(document.activeElement);
      active.value = true;
      activation = nextTick().then(() => {
        unregister?.();
        unregister = undefined;
        html = undefined;
        if (disposed) return;
        if (element.value) element.value.dataset.articleState = "active";
        findElement(focused)?.focus({ preventScroll: true });
      });
      return activation;
    }

    async function handleClick(event: MouseEvent) {
      if (active.value || !(event.target instanceof Element)) return;
      const control = event.target.closest("button, input, [role='button']");
      if (!control) return;
      const path = elementPath(control);
      if (!path) return;
      // A touch/keyboard click can arrive before the visibility observer.
      // Replay it on the live control instead of losing the first interaction.
      event.preventDefault();
      event.stopPropagation();
      await activate();
      findElement(path)?.click();
    }

    onMounted(() => {
      if (!element.value) return;
      element.value.dataset.articleState = active.value ? "active" : "static";
      if (!active.value) unregister = registerArticleSection(element.value, activate);
    });
    onBeforeUnmount(() => { disposed = true; unregister?.(); });

    return () => h("div", {
      // Vue 3.4 patches child nodes before clearing an old innerHTML prop.
      // Replace this small boundary atomically so that clearing cannot erase
      // newly mounted children (or leave duplicate static text behind).
      key: active.value ? "interactive" : "static",
      id: props.id,
      ref: element,
      class: "article-section",
      style: { "--article-section-height": `${props.estimatedHeight}px` },
      ...(active.value ? {} : { innerHTML: html }),
      onPointerover: (event: PointerEvent) => { if (event.pointerType === "mouse") void activate(); },
      onFocusin: activate,
      onClickCapture: handleClick,
      onContentvisibilityautostatechange: (event: Event & { skipped?: boolean }) => {
        if (event.skipped === false) void activate();
      },
    }, active.value ? slots.default?.() : undefined);
  },
});
</script>

<style>
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: auto var(--article-section-height, 1600px);
}
.article-section:first-child { content-visibility: visible; }
.article-section:not(:first-child) > .text-title:first-child { margin-top: 2.5rem; }
.article-section > :last-child { margin-bottom: 0; }
@media print {
  /* Full static text is already present, even in sections never activated. */
  .article-section { content-visibility: visible; contain-intrinsic-size: none; }
}
</style>
