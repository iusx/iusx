<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import "lenis/dist/lenis.css";

const route = useRoute();
const isReadingPage = computed(() => route.path.startsWith("/book/"));
const pagePath = computed(() => route.path.replace(/\/+$/, "") || "/");
const isContentDetail = computed(() => pagePath.value !== "/"
  && route.matched.some(record => record.name === "slug"));
const showHackerAmbient = computed(() => !isContentDetail.value && pagePath.value !== "/des");
const reducedMotion = usePreferredReducedMotion();
const pageTransitionActive = ref(false);
// The app mounts once per document load, so every entry route gets the intro
// while client-side navigation keeps the existing page transition.
const introActive = ref(true);
const introBlocking = ref(false);
provide("introBlocking", introBlocking);
function finishIntro() {
  introActive.value = false;
  introBlocking.value = false;
}
watch(pagePath, finishIntro);
provideTransitionSound();
const smoothScroller = shallowRef<import("lenis").default | null>(null);
provide("smoothScroller", smoothScroller);
let stopScrollWatcher: (() => void) | undefined;
watch([smoothScroller, introBlocking], ([scroller, blocked]) => {
  if (blocked) scroller?.stop();
  else scroller?.start();
});

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
    <HomeIntro v-if="introActive" @start="introBlocking = true" @finish="finishIntro" />
    <div class="scanline"></div>

    <an-more :inert="introBlocking" :appearance="route.path === '/des' || route.path === '/des/' ? 'artwork' : 'default'" />
    <div class="site-content" :inert="introBlocking">
      <NuxtLayout>
        <HackerPageTransition v-slot="{ transition }" @active-change="pageTransitionActive = $event">
          <NuxtPage :transition="transition" :page-key="pageRoute => pageRoute.path" />
        </HackerPageTransition>
      </NuxtLayout>
    </div>
    <ClientOnly>
      <HackerAmbient v-if="showHackerAmbient && !pageTransitionActive && !introActive" :key="pagePath" />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
@import "/public/scss/app.scss";

:root {
  --site-menu-width: 48px;
  --site-menu-height: 0px;
}

.site-content {
  min-height: 100dvh;
  box-sizing: border-box;
  padding-right: var(--site-menu-width);
  padding-bottom: var(--site-menu-height);
}

@media (max-width: 700px) {
  :root {
    --site-menu-width: 0px;
    --site-menu-height: calc(48px + env(safe-area-inset-bottom, 0px));
  }
}

@media print {
  :root { --site-menu-width: 0px; --site-menu-height: 0px; }
  .site-content { min-height: auto; padding-right: 0; padding-bottom: 0; }
}

@font-face {
  font-family: "Tsing";
  font-display: swap;
  src:
    url("/Tsing.woff2") format("woff2"),
    url("/Tsing.woff") format("woff"),
    url("/TSING.ttf") format("truetype");
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
