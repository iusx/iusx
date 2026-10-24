<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { createBackgroundPalette } from "~/utils/design-background";
import type { RGB } from "~/utils/design-background";
import { drawHackerNoise } from "~/utils/hacker-noise";

const canvas = ref<HTMLCanvasElement | null>(null);
const preferredMotion = usePreferredReducedMotion();
const colorMode = useColorMode();
const interactiveSelector = "a, button, input, textarea, select, summary, [role='button'], [tabindex], [contenteditable]:not([contenteditable='false']), img, video";
const motion = { intensity: 0, shift: 0 };
let animator: typeof import("gsap")["gsap"] | undefined;
let animation: import("gsap").gsap.core.Timeline | undefined;
let nextBurst: import("gsap").gsap.core.Tween | undefined;
let context: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | undefined;
let resumeTimer: ReturnType<typeof setTimeout> | undefined;
let disposed = false;
let hovering = false;
let pointerDown = false;
let scrolling = false;
let printing = false;
let windowActive = true;
let width = 0;
let height = 0;
let ratio = 1;
let color = "#38e7cd";
let burstCount = 0;
let lastFrame = -1;
let canvasDirty = false;
const removeListeners: Array<() => void> = [];

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(interactiveSelector));
}

function isPaused() {
  return disposed || document.hidden || !windowActive || printing
    || preferredMotion.value === "reduce" || hovering || pointerDown || scrolling
    || isInteractive(document.activeElement) || Boolean(window.getSelection()?.toString());
}

function clear() {
  if (!canvasDirty || !context || !canvas.value) return;
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);
  canvasDirty = false;
}

function stop() {
  nextBurst?.kill();
  nextBurst = undefined;
  animation?.kill();
  animation = undefined;
  motion.intensity = 0;
  motion.shift = 0;
  clear();
}

function draw() {
  if (!context || isPaused()) return;
  const frame = Math.floor(performance.now() * 0.018);
  if (frame === lastFrame) return;
  lastFrame = frame;
  clear();
  context.save();
  context.scale(ratio, ratio);
  context.translate(motion.shift, 0);
  drawHackerNoise(context, width, height, {
    frame,
    color,
    intensity: motion.intensity,
    rows: width < 700 ? 2 : 3,
    particles: Math.min(32, Math.max(10, Math.round(width * height / 45000))),
  });
  context.restore();
  canvasDirty = true;
}

function schedule() {
  if (!animator || isPaused() || nextBurst || animation || !width || !height) return;
  // A short, irregular burst; no render loop runs between bursts.
  const delay = 1.4 + (Math.sin(++burstCount * 12.9898) + 1) * 0.8;
  nextBurst = animator.delayedCall(delay, burst);
}

function burst() {
  nextBurst = undefined;
  if (!animator || isPaused()) return;
  updateColor();
  lastFrame = -1;
  animation = animator.timeline({
    onUpdate: draw,
    onComplete: () => {
      animation = undefined;
      clear();
      schedule();
    },
  });
  // Only decorative pixels move. Page text, layout and fixed controls stay stable.
  animation.to(motion, { intensity: 0.38, shift: 1.5, duration: 0.045, ease: "none" })
    .to(motion, { intensity: 0.46, shift: -2, duration: 0.055, ease: "steps(2)" })
    .to(motion, { intensity: 0.32, shift: 0.7, duration: 0.065, ease: "none" })
    .to(motion, { intensity: 0, shift: 0, duration: 0.13, ease: "power2.out" });
}

function sync() {
  if (isPaused()) stop();
  else schedule();
}

function updateColor() {
  // Pages can have their own surface (e.g. the white Library in dark mode).
  const surface = document.querySelector(".site-content main, .site-content .page-container")
    ?? document.querySelector(".site-content");
  const fallback: RGB = colorMode.value === "dark" ? [0, 0, 0] : [255, 255, 255];
  let rgb = fallback;
  for (let element = surface; element; element = element.parentElement) {
    const values = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (values && values.length >= 3 && (values[3] ?? 1) >= 0.9) {
      rgb = values.slice(0, 3) as RGB;
      break;
    }
  }
  color = createBackgroundPalette(rgb).accent;
}

function resize() {
  const element = canvas.value;
  if (!element || !context) return;
  const bounds = element.getBoundingClientRect();
  width = Math.round(bounds.width);
  height = Math.round(bounds.height);
  ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const bufferWidth = Math.max(1, Math.round(width * ratio));
  const bufferHeight = Math.max(1, Math.round(height * ratio));
  if (element.width !== bufferWidth) { element.width = bufferWidth; canvasDirty = false; }
  if (element.height !== bufferHeight) { element.height = bufferHeight; canvasDirty = false; }
  clear();
  updateColor();
  sync();
}

function pointerOver(event: PointerEvent) {
  const nextHovering = event.pointerType !== "touch" && isInteractive(event.target);
  if (hovering === nextHovering) return;
  hovering = nextHovering;
  sync();
}

function pointerOut(event: PointerEvent) {
  const nextHovering = event.pointerType !== "touch" && isInteractive(event.relatedTarget);
  if (hovering === nextHovering) return;
  hovering = nextHovering;
  sync();
}

function pauseForScroll() {
  if (!scrolling) {
    scrolling = true;
    stop();
  }
  if (resumeTimer) clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => { scrolling = false; sync(); }, 240);
}

function listen(target: EventTarget, event: string, listener: EventListener, options?: AddEventListenerOptions) {
  target.addEventListener(event, listener, options);
  removeListeners.push(() => target.removeEventListener(event, listener, options));
}

watch(preferredMotion, sync);
watch(() => colorMode.value, updateColor, { flush: "post" });

onMounted(async () => {
  if (!canvas.value) return;
  context = canvas.value.getContext("2d");
  if (!context) return;
  windowActive = document.hasFocus();
  hovering = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && Array.from(document.querySelectorAll(":hover")).some(isInteractive);
  listen(document, "pointerover", pointerOver as EventListener, { passive: true });
  listen(document, "pointerout", pointerOut as EventListener, { passive: true });
  listen(document, "pointerdown", () => { pointerDown = true; sync(); }, { passive: true });
  listen(document, "pointerup", () => { pointerDown = false; sync(); }, { passive: true });
  listen(document, "pointercancel", () => { pointerDown = false; sync(); }, { passive: true });
  listen(document, "focusin", sync);
  listen(document, "focusout", () => queueMicrotask(sync));
  listen(document, "selectionchange", sync);
  listen(document, "visibilitychange", () => { resize(); sync(); });
  listen(window, "blur", () => { windowActive = false; pointerDown = false; sync(); });
  listen(window, "focus", () => { windowActive = true; resize(); sync(); });
  listen(window, "scroll", pauseForScroll, { passive: true, capture: true });
  listen(window, "beforeprint", () => { printing = true; sync(); });
  listen(window, "afterprint", () => { printing = false; resize(); sync(); });
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value);
  resize();
  const { gsap } = await import("gsap");
  if (disposed) return;
  animator = gsap;
  schedule();
});

onBeforeUnmount(() => {
  disposed = true;
  stop();
  if (resumeTimer) clearTimeout(resumeTimer);
  resizeObserver?.disconnect();
  removeListeners.forEach(remove => remove());
});
</script>

<template>
  <canvas ref="canvas" class="hacker-ambient" aria-hidden="true"></canvas>
</template>

<style scoped>
.hacker-ambient {
  position: fixed;
  inset: 0 var(--site-menu-width, 0px) var(--site-menu-height, 0px) 0;
  width: calc(100% - var(--site-menu-width, 0px));
  height: calc(100% - var(--site-menu-height, 0px));
  pointer-events: none;
  z-index: 110;
}

@media print, (prefers-reduced-motion: reduce) {
  .hacker-ambient { display: none; }
}
</style>
