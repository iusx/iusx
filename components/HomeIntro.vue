<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion, useScrollLock } from "@vueuse/core";
import { BRAND_MARK_PATHS } from "~/utils/brand-mark";

const emit = defineEmits<{ start: []; finish: [] }>();
const root = ref<HTMLElement | null>(null);
const scrollRoot = ref<HTMLElement | null>(typeof document === "undefined" ? null : document.documentElement);
const scrollLocked = useScrollLock(scrollRoot, false);
const reducedMotion = usePreferredReducedMotion();
const fragments = [
  { x: -88, y: -64, delay: 100 }, { x: 72, y: -88, delay: 170 },
  { x: 108, y: 16, delay: 230 }, { x: 64, y: 94, delay: 140 },
  { x: -40, y: 110, delay: 210 }, { x: -110, y: 36, delay: 280 },
];
let fallback: ReturnType<typeof setTimeout> | undefined;
let finished = false;

function finish() {
  if (finished) return;
  finished = true;
  clearTimeout(fallback);
  scrollLocked.value = false;
  emit("finish");
}

function onAnimationEnd(event: AnimationEvent) {
  if (event.target === event.currentTarget) finish();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") finish();
}

function onVisibilityChange() {
  if (document.hidden) finish();
}

watch(reducedMotion, value => { if (value === "reduce") finish(); });
onMounted(() => {
  // The CSS timeline starts with SSR markup; late hydration must not replay it.
  if (reducedMotion.value === "reduce" || document.hidden || !root.value
    || getComputedStyle(root.value).visibility === "hidden") {
    finish();
    return;
  }
  scrollLocked.value = true;
  emit("start");
  fallback = setTimeout(finish, 1900);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeprint", finish);
});
onBeforeUnmount(() => {
  clearTimeout(fallback);
  scrollLocked.value = false;
  document.removeEventListener("keydown", onKeydown);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("beforeprint", finish);
});
</script>

<template>
  <div ref="root" class="home-intro" aria-hidden="true" @animationend="onAnimationEnd">
    <div class="intro-stage">
      <span v-for="(fragment, index) in fragments" :key="index" class="intro-fragment"
        :style="{ '--x': `${fragment.x}px`, '--y': `${fragment.y}px`, '--delay': `${fragment.delay}ms` }" />
      <svg class="intro-wind" viewBox="0 0 280 280" fill="none">
        <path d="M48 143C26 80 97 38 151 60" />
        <path d="M155 34C222 36 260 111 218 166" />
        <path d="M231 186C211 247 129 252 91 215" />
        <path d="M78 237C19 206 24 140 61 108" />
      </svg>
      <svg class="intro-mark" viewBox="0 0 377 377" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="intro-leaves">
          <path v-for="(path, index) in BRAND_MARK_PATHS" :key="index" :d="path" class="intro-leaf" fill="#38E7CD" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.home-intro {
  --intro-bg: #fff;
  --intro-accent: #38e7cd;
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--intro-bg);
  pointer-events: none;
  animation: home-intro-out 1650ms both;
}

@media (prefers-color-scheme: dark) {
  .home-intro { --intro-bg: #000; }
}
.dark-mode .home-intro { --intro-bg: #000; }
.light-mode .home-intro { --intro-bg: #fff; }

.intro-stage { position: relative; width: 280px; height: 280px; display: grid; place-items: center; }
.intro-mark { position: relative; width: 164px; height: 164px; overflow: visible; animation: mark-presence 1300ms both; }
.intro-leaves { transform-box: view-box; transform-origin: 188.5px 188.5px; animation: mark-turn 1050ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.intro-leaf {
  transform-box: view-box;
  transform-origin: 264px 155px;
  animation: leaf-assemble 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.intro-leaf:nth-child(1) { --leaf-x: -56px; --leaf-y: -38px; --leaf-turn: -30deg; animation-delay: 80ms; }
.intro-leaf:nth-child(2) { --leaf-x: -76px; --leaf-y: 4px; --leaf-turn: -38deg; animation-delay: 145ms; }
.intro-leaf:nth-child(3) { --leaf-x: 32px; --leaf-y: 68px; --leaf-turn: 30deg; animation-delay: 210ms; }
.intro-leaf:nth-child(4) { --leaf-x: -30px; --leaf-y: 56px; --leaf-turn: 32deg; animation-delay: 275ms; }

.intro-wind { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.intro-wind path {
  stroke: var(--intro-accent);
  stroke-width: 0.65;
  stroke-linecap: round;
  stroke-dasharray: 48 220;
  animation: wind-pass 850ms ease-out both;
}
.intro-wind path:nth-child(2) { animation-delay: 80ms; }
.intro-wind path:nth-child(3) { animation-delay: 160ms; }
.intro-wind path:nth-child(4) { animation-delay: 240ms; }

.intro-fragment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 2px;
  background: var(--intro-accent);
  animation: fragment-gather 650ms var(--delay) cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes leaf-assemble {
  0% { opacity: 0; transform: translate(var(--leaf-x), var(--leaf-y)) rotate(var(--leaf-turn)) scale(0.65); }
  22% { opacity: 0.85; }
  100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes mark-turn {
  0% { transform: rotate(-76deg) scale(0.76); }
  80% { transform: rotate(4deg) scale(1); }
  100% { transform: rotate(0) scale(1); }
}
@keyframes mark-presence {
  0%, 55% { filter: drop-shadow(0 0 0 transparent); }
  75% { filter: drop-shadow(0 0 10px rgb(56 231 205 / 22%)); }
  100% { filter: drop-shadow(0 0 0 transparent); }
}
@keyframes wind-pass {
  0% { opacity: 0; stroke-dashoffset: 65; transform: rotate(-18deg); transform-origin: center; }
  25% { opacity: 0.28; }
  100% { opacity: 0; stroke-dashoffset: -180; transform: rotate(12deg); transform-origin: center; }
}
@keyframes fragment-gather {
  0% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.5); }
  25% { opacity: 0.6; }
  100% { opacity: 0; transform: translate(calc(var(--x) * 0.38), calc(var(--y) * 0.38)) scale(0.5); }
}
@keyframes home-intro-out {
  0%, 73% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}

@media (max-width: 640px) {
  .intro-stage { transform: scale(0.82); }
}
@media (prefers-reduced-motion: reduce), print {
  .home-intro { display: none; animation: none; }
  .home-intro * { animation: none !important; }
}
</style>
