<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, shallowRef, watch } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import "lenis/dist/lenis.css";

const route = useRoute();
const isReadingPage = computed(() => route.path.startsWith("/book/"));
const reducedMotion = usePreferredReducedMotion();
const smoothScroller = shallowRef<import("lenis").default | null>(null);
provide("smoothScroller", smoothScroller);
let stopScrollWatcher: (() => void) | undefined;

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ritsu` : "ritsu";
  },
});

onMounted(() => {
  stopScrollWatcher = watch(reducedMotion, async (motion, _, onCleanup) => {
    if (motion === "reduce") return;

    let cancelled = false;
    let lenis: import("lenis").default | undefined;
    onCleanup(() => {
      cancelled = true;
      smoothScroller.value = null;
      lenis?.destroy();
    });
    const { default: Lenis } = await import("lenis");
    if (cancelled) return;
    lenis = new Lenis({ lerp: 0.1, duration: 1.2, autoRaf: true, allowNestedScroll: true });
    smoothScroller.value = lenis;
  }, { immediate: true });
});
onBeforeUnmount(() => stopScrollWatcher?.());
</script>

<template>
  <div id="app" :class="{ 'reading-page': isReadingPage }">
    <div class="scanline"></div>

    <an-more />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import "/public/scss/app.scss";

@font-face {
  font-family: "Tsing";
  font-display: swap;
  src:
    url("/Tsing.woff2") format("woff2"),
    url("/Tsing.woff") format("woff"),
    url("/Tsing.ttf") format("truetype");
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.03)
    );
  background-size:
    100% 4px,
    3px 100%;
  pointer-events: none;
  z-index: 100;
}

@media (prefers-color-scheme: light) {
  body,
  html {
    background: #f4f5f7;
  }
}

.light-mode .scanline {
  opacity: 0.3;
  background:
    linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 50%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02));
  background-size: 100% 3px, 3px 100%;
}
</style>
