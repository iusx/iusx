<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { TransitionProps } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { createBackgroundPalette } from "~/utils/design-background";
import type { RGB } from "~/utils/design-background";
import { drawHackerNoise } from "~/utils/hacker-noise";
import { transitionSoundKey } from "~/composables/useTransitionSound";

const emit = defineEmits<{ "active-change": [active: boolean] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
const active = ref(false);
const reducedMotion = usePreferredReducedMotion();
const colorMode = useColorMode();
const sound = inject(transitionSoundKey, undefined);
const originals = new WeakMap<HTMLElement, { opacity: string; willChange: string; inert: boolean }>();
let context: CanvasRenderingContext2D | null = null;
let frame = 0;
let width = 0;
let height = 0;
let ratio = 1;
let surface = "#000";
let accent = "#38e7cd";
let finish: (() => void) | undefined;
let tiles: Array<{ x: number; y: number; threshold: number }> = [];
let cellSize = 24;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const hash = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
};
// Particle seeds are fixed throughout every transition. Reuse their original
// trajectories instead of recomputing the same trigonometry on every frame.
function createParticles() {
  return Array.from({ length: 180 }, (_, index) => {
    const seed = index * 17 + 3;
    return {
      x: hash(seed),
      y: hash(seed + 2),
      travelX: 20 + hash(seed + 1) * 100,
      travelY: 6 + hash(seed + 3) * 32,
      size: 1 + Math.floor(hash(seed + 4) * 3),
      opacity: 0.25 + hash(seed + 5) * 0.65,
      lineWidth: index % 9 === 0 ? 8 + hash(seed + 6) * 28 : 0,
    };
  });
}
let particles: ReturnType<typeof createParticles> | undefined;

function setActive(value: boolean) {
  active.value = value;
  emit("active-change", value);
}

function clear() {
  context?.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);
  setActive(false);
}

function canAnimate() {
  return context && reducedMotion.value !== "reduce" && !document.hidden;
}

function prepare(element: Element) {
  if (!(element instanceof HTMLElement) || !canAnimate()) return;
  if (!originals.has(element)) {
    originals.set(element, { opacity: element.style.opacity, willChange: element.style.willChange, inert: element.inert });
  }
  element.style.willChange = "opacity";
  element.inert = true;
}

function restore(element: Element) {
  if (!(element instanceof HTMLElement)) return;
  const original = originals.get(element);
  if (!original) return;
  element.style.opacity = original.opacity;
  element.style.willChange = original.willChange;
  element.inert = original.inert;
  originals.delete(element);
}

function resize() {
  const element = canvas.value;
  if (!element || !context) return;
  const bounds = element.getBoundingClientRect();
  const nextWidth = Math.round(bounds.width);
  const nextHeight = Math.round(bounds.height);
  ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const bufferWidth = Math.max(1, Math.round(nextWidth * ratio));
  const bufferHeight = Math.max(1, Math.round(nextHeight * ratio));
  if (element.width !== bufferWidth) element.width = bufferWidth;
  if (element.height !== bufferHeight) element.height = bufferHeight;
  if (width === nextWidth && height === nextHeight) return;
  width = nextWidth;
  height = nextHeight;
  cellSize = Math.max(18, Math.ceil(width / 44));
  tiles = [];
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      tiles.push({ x, y, threshold: (x / width) * 0.55 + (y / height) * 0.15 + hash(x * 3 + y * 7) * 0.3 });
    }
  }
}

function updatePalette(element: Element) {
  let rgb: RGB = colorMode.value === "dark" ? [0, 0, 0] : [255, 255, 255];
  for (let node: Element | null = element; node; node = node.parentElement) {
    const values = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (values && values.length >= 3 && (values[3] ?? 1) >= 0.9) {
      rgb = values.slice(0, 3) as RGB;
      break;
    }
  }
  surface = `rgb(${rgb.join(",")})`;
  accent = createBackgroundPalette(rgb).accent;
}

function draw(progress: number, leaving: boolean) {
  if (!context) return;
  particles ??= createParticles();
  context.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  context.save();
  context.scale(ratio, ratio);
  const coverage = (leaving ? progress : 1 - progress) * 1.2;
  const envelope = Math.sin(progress * Math.PI);
  context.fillStyle = surface;
  for (const tile of tiles) {
    context.globalAlpha = clamp((coverage - tile.threshold) / 0.18);
    if (context.globalAlpha) context.fillRect(tile.x, tile.y, cellSize + 0.5, cellSize + 0.5);
  }

  // Small data fragments travel across the pixel veil; no DOM screenshots or textures.
  const count = width < 700 ? 90 : 180;
  const direction = leaving ? 1 : -1;
  context.fillStyle = accent;
  for (let index = 0; index < count; index++) {
    const particle = particles[index];
    const x = particle.x * width + direction * progress * particle.travelX;
    const y = particle.y * height - progress * particle.travelY;
    context.globalAlpha = envelope * particle.opacity;
    context.fillRect(x, y, particle.size, particle.size);
    if (particle.lineWidth) context.fillRect(x - 12, y, particle.lineWidth, 1);
  }
  drawHackerNoise(context, width, height, {
    frame: Math.floor(progress * 14), color: accent, intensity: envelope * 0.45, rows: 3, particles: 16,
  });
  context.restore();
}

function animate(element: Element, done: () => void, leaving: boolean) {
  finish?.();
  if (!(element instanceof HTMLElement) || !canAnimate()) {
    sound?.stop();
    restore(element);
    clear();
    done();
    return;
  }
  prepare(element);
  resize();
  updatePalette(element);
  setActive(true);
  if (leaving) sound?.play();
  const started = performance.now();
  const duration = leaving ? 200 : 320;
  let settled = false;
  const complete = () => {
    if (settled) return;
    settled = true;
    cancelAnimationFrame(frame);
    finish = undefined;
    restore(element);
    if (!leaving) clear();
    done();
  };
  finish = complete;
  const tick = (time: number) => {
    const progress = clamp((time - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.style.opacity = String(leaving ? 1 - progress * progress : eased);
    draw(progress, leaving);
    if (progress < 1) frame = requestAnimationFrame(tick);
    else complete();
  };
  tick(started);
}

function cancel(element: Element) {
  sound?.stop();
  finish?.();
  restore(element);
  clear();
}

const transition: TransitionProps = {
  name: "hacker-page", mode: "out-in", css: false, appear: false,
  onBeforeEnter: element => {
    prepare(element);
    if (element instanceof HTMLElement && canAnimate()) element.style.opacity = "0";
  },
  onLeave: (element, done) => animate(element, done, true),
  onEnter: (element, done) => animate(element, done, false),
  onLeaveCancelled: cancel,
  onEnterCancelled: cancel,
};

function skip() {
  sound?.stop();
  finish?.();
  clear();
}

function onVisibilityChange() {
  if (document.hidden) skip();
}

watch(reducedMotion, value => { if (value === "reduce") skip(); });
onMounted(() => {
  context = canvas.value?.getContext("2d") ?? null;
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("beforeprint", skip);
  document.addEventListener("visibilitychange", onVisibilityChange);
});
onBeforeUnmount(() => {
  skip();
  window.removeEventListener("resize", resize);
  window.removeEventListener("beforeprint", skip);
  document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>

<template>
  <slot :transition="transition" />
  <canvas ref="canvas" class="page-transition-particles" :class="{ 'is-active': active }" aria-hidden="true" />
</template>

<style scoped>
.page-transition-particles {
  position: fixed;
  inset: 0 var(--site-menu-width, 0px) var(--site-menu-height, 0px) 0;
  width: calc(100% - var(--site-menu-width, 0px));
  height: calc(100% - var(--site-menu-height, 0px));
  pointer-events: none;
  visibility: hidden;
  z-index: 150;
}
.page-transition-particles.is-active { visibility: visible; }
@media print, (prefers-reduced-motion: reduce) {
  .page-transition-particles { display: none; }
}
</style>
