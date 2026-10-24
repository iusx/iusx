<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion, useScrollLock } from "@vueuse/core";
import { BRAND_MARK_PATHS } from "~/utils/brand-mark";

const emit = defineEmits<{ start: []; finish: [] }>();
const root = ref<HTMLElement | null>(null);
const scrollRoot = ref<HTMLElement | null>(typeof document === "undefined" ? null : document.documentElement);
const scrollLocked = useScrollLock(scrollRoot, false);
const reducedMotion = usePreferredReducedMotion();
let watchdog: ReturnType<typeof setTimeout> | undefined;
let finished = false;

function cleanup() {
  clearTimeout(watchdog);
  scrollLocked.value = false;
  document.removeEventListener("keydown", onKeydown);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("beforeprint", finish);
}

function finish() {
  if (finished) return;
  finished = true;
  cleanup();
  emit("finish");
}

function onAnimationEnd(event: AnimationEvent) {
  if (event.target === event.currentTarget && event.animationName.startsWith("home-intro-out")) finish();
}
function onKeydown(event: KeyboardEvent) { if (event.key === "Escape") finish(); }
function onVisibilityChange() { if (document.hidden) finish(); }

watch(reducedMotion, value => { if (value === "reduce") finish(); });
onMounted(() => {
  const element = root.value;
  const style = element ? getComputedStyle(element) : undefined;
  if (reducedMotion.value === "reduce" || document.hidden || !element
    || style?.display === "none" || style?.visibility === "hidden") {
    finish();
    return;
  }
  // CSS has already been playing since first paint. Hydration never restarts it.
  const exit = element.getAnimations?.().find(animation =>
    (animation as CSSAnimation).animationName?.startsWith("home-intro-out"));
  const elapsed = typeof exit?.currentTime === "number" ? exit.currentTime : 0;
  const remaining = Math.max(0, 820 - elapsed);
  if (exit?.playState === "finished" || remaining === 0) {
    finish();
    return;
  }
  scrollLocked.value = true;
  emit("start");
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeprint", finish);
  watchdog = setTimeout(finish, remaining + 100);
});
onBeforeUnmount(() => {
  finished = true;
  cleanup();
});
</script>

<template>
  <div ref="root" class="home-intro" aria-hidden="true" @animationend="onAnimationEnd">
    <svg class="intro-mark" viewBox="0 0 377 377" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path v-for="(path, index) in BRAND_MARK_PATHS" :key="index" :d="path" fill="#38E7CD" />
    </svg>
  </div>
</template>

<style scoped>
.home-intro {
  --intro-bg: #fff;
  --intro-zoom: 8;
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--intro-bg);
  pointer-events: auto;
  /* SSR includes this stylesheet: motion and exit do not wait for JavaScript. */
  animation: home-intro-out 820ms linear both;
}
@media (prefers-color-scheme: dark) { .home-intro { --intro-bg: #000; } }
.dark-mode .home-intro { --intro-bg: #000; }
.light-mode .home-intro { --intro-bg: #fff; }
@media (max-width: 600px) { .home-intro { --intro-zoom: 6; } }
@media (min-width: 2000px) { .home-intro { --intro-zoom: 10; } }
@media (min-width: 1200px) and (min-aspect-ratio: 21/9) { .home-intro { --intro-zoom: 12; } }

.intro-mark {
  flex: none;
  width: clamp(190px, 26vmin, 260px);
  height: clamp(190px, 26vmin, 260px);
  overflow: visible;
  transform-box: border-box;
  transform-origin: center;
  will-change: transform, opacity;
  animation: intro-pullback 660ms cubic-bezier(0.22, 1, 0.36, 1) both,
    intro-appear 90ms linear both;
}
@keyframes intro-pullback {
  /* Keep the initial leaf joint centered, with the entire mark on one layer. */
  from { transform: scale(var(--intro-zoom)) rotate(-12deg) translate(-20.0265%, 8.8859%); }
  to { transform: scale(1) rotate(0) translate(0, 0); }
}
@keyframes intro-appear {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes home-intro-out {
  0%, 74% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; pointer-events: none; }
}
@media (prefers-reduced-motion: reduce), print {
  .home-intro { display: none; animation: none; }
  .home-intro * { animation: none !important; }
}
</style>
