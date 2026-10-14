<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ShallowRef } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import type { DesignStage, StageImage } from "~/utils/design-stage";
import { createBackgroundPalette, sampleImageBackground } from "~/utils/design-background";
import type { BackgroundPalette, RGB } from "~/utils/design-background";
import { drawHackerNoise } from "~/utils/hacker-noise";

useSeoMeta({
  title: "Design",
  description: "An interactive gallery of visual work by ritsu.",
});
useHead({ bodyAttrs: { class: "design-exhibition" } });

const { data: content } = await useAsyncData("equalDes", () => queryContent("des/").find());
const dateValue = (value: string) => {
  const parts = value.split(/[.-]/).map(Number);
  return parts.length === 3 ? Date.UTC(parts[0], parts[1] - 1, parts[2]) : 0;
};
const projects = computed(() => [...(content.value || [])]
  .filter((work) => work.img && work.url)
  .sort((a, b) => dateValue(String(b.time)) - dateValue(String(a.time)))
  .map((work) => ({
    id: work._path || String(work.title),
    title: String(work.title || "Untitled"),
    image: String(work.img),
    url: String(work.url),
    year: String(work.time || "").slice(0, 4),
    client: String(work.client || ""),
    director: String(work.director || "ritsu"),
  })));

const root = ref<HTMLElement | null>(null);
const artwork = ref<HTMLElement | null>(null);
const stageHost = ref<HTMLElement | null>(null);
const cipherCanvas = ref<HTMLCanvasElement | null>(null);
const worksMenu = ref<HTMLElement | null>(null);
const worksMenuButton = ref<HTMLButtonElement | null>(null);
const worksMenuScrim = ref<HTMLElement | null>(null);
const menuOpen = ref(false);
const menuVisible = ref(false);
const currentIndex = ref(0);
const pendingIndex = ref<number | null>(null);
const current = computed(() => projects.value[currentIndex.value]);
const pending = computed(() => pendingIndex.value === null ? undefined : projects.value[pendingIndex.value]);
const busy = ref(false);
const transitioning = ref(false);
const dragging = ref(false);
const canvasReady = ref(false);
const imageFailed = ref(false);
const pointerOver = ref(false);
const focusWithin = ref(false);
const touchInspect = ref(false);
const manuallyPaused = ref(false);
const tabHidden = ref(false);
const preferredMotion = usePreferredReducedMotion();
const reduced = computed(() => preferredMotion.value === "reduce");
const inspecting = computed(() => pointerOver.value || focusWithin.value || touchInspect.value || menuVisible.value);
const detailsVisible = computed(() => inspecting.value && !menuVisible.value && !transitioning.value && !dragging.value);
const pauseAutoplay = computed(() => inspecting.value || dragging.value || manuallyPaused.value || tabHidden.value || reduced.value || busy.value);
const smoothScroller = inject<ShallowRef<import("lenis").default | null>>("smoothScroller");
const positionLabel = computed(() => `${currentIndex.value + 1} / ${projects.value.length}`);
const defaultPalette = createBackgroundPalette([5, 6, 6]);
const imagePalettes = new Map<string, BackgroundPalette>();
let visiblePalette = defaultPalette;
let transitionFromPalette = defaultPalette;
let transitionToPalette = defaultPalette;
const previousBodyStyles = new Map<string, { value: string; priority: string }>();

const driver = { transition: 0, transitionFx: 0, dragX: 0, direction: 1, hover: 0, pointerX: 0, pointerY: 0, reduced: false };
let animator: typeof import("gsap")["gsap"] | undefined;
let stage: DesignStage | undefined;
let activeTexture: StageImage | null = null;
let transitionTween: { kill: () => void } | undefined;
let settleTween: { kill: () => void } | undefined;
let menuTween: { kill: () => void } | undefined;
let menuAnimationId = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let stopScrollerWatcher: (() => void) | undefined;
let resizeObserver: ResizeObserver | undefined;
let cipherContext: CanvasRenderingContext2D | null = null;
let disposed = false;
let lastCipherFrame = -1;
let wheelTotal = 0;
let wheelTime = 0;
let wheelAxis: "x" | "y" | undefined;
let inputLockedUntil = 0;
let gesture: { id: number; type: string; x: number; y: number; lastX: number; lastY: number; startDrag: number } | undefined;
const disposeListeners: Array<() => void> = [];

function applyPalette(palette: BackgroundPalette) {
  if (disposed) return;
  visiblePalette = palette;
  const ink = palette.isLight ? 0 : 255;
  const muted = palette.rgb.map(channel => Math.round(ink * 0.75 + channel * 0.25));
  const line = palette.rgb.map(channel => Math.round(ink * 0.2 + channel * 0.8));
  const styles: Record<string, string> = {
    "--gallery-bg": palette.background,
    "--gallery-rgb": palette.rgb.join(", "),
    "--gallery-ink": palette.foreground,
    "--gallery-ink-rgb": `${ink}, ${ink}, ${ink}`,
    "--gallery-muted": `rgb(${muted.join(", ")})`,
    "--gallery-line": `rgb(${line.join(", ")})`,
    "--gallery-accent": palette.accent,
  };
  for (const [property, value] of Object.entries(styles)) {
    root.value?.style.setProperty(property, value);
    // The navigation HUD is a sibling of this page and inherits from body.
    if (!previousBodyStyles.has(property)) previousBodyStyles.set(property, {
      value: document.body.style.getPropertyValue(property),
      priority: document.body.style.getPropertyPriority(property),
    });
    document.body.style.setProperty(property, value);
  }
}

function rememberPalette(url: string, palette: BackgroundPalette | null) {
  if (disposed || !palette) return;
  imagePalettes.set(url, palette);
  if (pending.value?.image === url) transitionToPalette = palette;
  if (!busy.value && current.value?.image === url) applyPalette(palette);
}

function imageLoaded(event: Event, url: string) {
  const image = event.target as HTMLImageElement;
  rememberPalette(url, imagePalettes.get(url) ?? sampleImageBackground(image));
}

function updateTransitionPalette() {
  const progress = driver.transition;
  const blend = progress * progress * (3 - 2 * progress);
  const rgb = transitionFromPalette.rgb.map((channel, index) =>
    channel + (transitionToPalette.rgb[index] - channel) * blend) as RGB;
  applyPalette(createBackgroundPalette(rgb));
}

function clearAutoplay() {
  if (timer !== undefined) clearTimeout(timer);
  timer = undefined;
}

function scheduleAutoplay() {
  clearAutoplay();
  if (disposed || pauseAutoplay.value || projects.value.length < 2 || !animator) return;
  timer = setTimeout(() => changeWork(1), 7500);
}

function syncFrame() {
  if (disposed || tabHidden.value) return;
  stage?.setMotion(driver);
  stage?.render(animator?.ticker.time ?? performance.now() / 1000);
}

function updateInspection() {
  driver.hover = inspecting.value ? 1 : 0;
  driver.pointerX = 0;
  driver.pointerY = 0;
  clearCipher();
  syncFrame();
  scheduleAutoplay();
}

watch(inspecting, updateInspection, { flush: "sync" });
watch(dragging, scheduleAutoplay, { flush: "sync" });
watch([manuallyPaused, tabHidden, reduced], () => {
  driver.reduced = reduced.value;
  clearCipher();
  syncFrame();
  scheduleAutoplay();
}, { flush: "sync" });

function preloadNext() {
  if (!stage || disposed || projects.value.length < 2) return;
  const next = projects.value[(currentIndex.value + 1) % projects.value.length];
  void stage.loadImage(next.image);
  const previous = projects.value[(currentIndex.value - 1 + projects.value.length) % projects.value.length];
  void stage.loadImage(previous.image);
}

async function goTo(index: number, direction = 1) {
  if (disposed || busy.value || menuOpen.value || !animator || index === currentIndex.value || !projects.value[index]) return;
  settleTween?.kill();
  settleTween = undefined;
  clearAutoplay();
  busy.value = true;
  pendingIndex.value = index;
  driver.direction = direction;
  driver.transition = 0;
  const nextTexture = stage ? await stage.loadImage(projects.value[index].image) : null;
  if (disposed) return;
  rememberPalette(projects.value[index].image, nextTexture?.background ?? null);
  transitionFromPalette = visiblePalette;
  transitionToPalette = imagePalettes.get(projects.value[index].image) ?? defaultPalette;

  // The DOM image is always underneath the canvas, including on WebGL failure.
  canvasReady.value = Boolean(stage && activeTexture && nextTexture);
  if (stage && activeTexture && nextTexture) stage.setImages(activeTexture, nextTexture);
  root.value?.style.setProperty("--mix", "0");
  transitioning.value = true;
  driver.transitionFx = reduced.value ? 0 : 1;
  transitionTween = animator.to(driver, {
    transition: 1,
    dragX: 0,
    duration: reduced.value ? 0.18 : 1.2,
    ease: "none",
    onUpdate: () => {
      root.value?.style.setProperty("--mix", String(driver.transition));
      updateTransitionPalette();
      stage?.setMotion(driver);
    },
    onComplete: () => {
      currentIndex.value = index;
      pendingIndex.value = null;
      activeTexture = nextTexture;
      if (stage && nextTexture) stage.setImages(nextTexture);
      driver.transition = 0;
      driver.transitionFx = 0;
      driver.dragX = 0;
      root.value?.style.setProperty("--mix", "0");
      canvasReady.value = Boolean(stage && nextTexture);
      applyPalette(transitionToPalette);
      imageFailed.value = false;
      busy.value = false;
      transitioning.value = false;
      transitionTween = undefined;
      syncFrame();
      preloadNext();
      scheduleAutoplay();
    },
  });
}

function changeWork(direction: number) {
  if (menuVisible.value) return;
  const count = projects.value.length;
  if (count < 2) return;
  void goTo((currentIndex.value + direction + count) % count, direction);
}

function handleWheel(event: WheelEvent) {
  if (event.ctrlKey || event.metaKey) return;
  if (menuVisible.value) {
    wheelTotal = 0;
    wheelAxis = undefined;
    if (!worksMenu.value?.contains(event.target as Node)) event.preventDefault();
    return;
  }
  event.preventDefault();
  const now = performance.now();
  if (busy.value || dragging.value || now < inputLockedUntil) {
    inputLockedUntil = Math.max(inputLockedUntil, now + 220);
    wheelTotal = 0;
    wheelTime = now;
    return;
  }
  if (now - wheelTime > 220 || !wheelAxis) {
    wheelAxis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? "x" : "y";
    wheelTotal = 0;
  }
  const delta = wheelAxis === "x" ? event.deltaX : event.deltaY;
  if (Math.sign(wheelTotal) !== Math.sign(delta)) wheelTotal = 0;
  const size = wheelAxis === "x" ? window.innerWidth : window.innerHeight;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size : 1;
  wheelTotal += delta * unit;
  wheelTime = now;
  if (Math.abs(wheelTotal) < 65) return;
  inputLockedUntil = now + 1100;
  changeWork(wheelTotal > 0 ? 1 : -1);
  wheelTotal = 0;
}

function handleKey(event: KeyboardEvent) {
  if (event.altKey || event.metaKey || event.ctrlKey) return;
  if (menuVisible.value) {
    handleMenuKey(event);
    return;
  }
  if (event.key === "Escape") {
    cancelGesture();
    touchInspect.value = false;
    (document.activeElement as HTMLElement)?.blur();
    return;
  }
  const target = event.target as HTMLElement;
  if (dragging.value) return;
  if (target.closest("button, a, input, textarea, select, [contenteditable]")) return;
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    changeWork(1);
  } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    changeWork(-1);
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    void goTo(event.key === "Home" ? 0 : projects.value.length - 1, event.key === "Home" ? -1 : 1);
  }
}

function pointerEnter(event: PointerEvent) {
  if (menuVisible.value) return;
  if (event.pointerType === "mouse" || event.pointerType === "pen") pointerOver.value = true;
}

function pointerMove(event: PointerEvent) {
  if (menuVisible.value) return;
  if (gesture && event.pointerId === gesture.id) {
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;
    const width = artwork.value?.getBoundingClientRect().width || 1;
    driver.dragX = Math.max(-0.6, Math.min(0.6, gesture.startDrag + (event.clientX - gesture.x) / width));
    syncFrame();
    return;
  }
  if (event.pointerType !== "mouse" || inspecting.value || !artwork.value) return;
  const bounds = artwork.value.getBoundingClientRect();
  driver.pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  driver.pointerY = 1 - (event.clientY - bounds.top) / bounds.height * 2;
}

function pointerDown(event: PointerEvent) {
  if (menuVisible.value) return;
  if (!event.isPrimary || event.button !== 0 || gesture || (event.target as HTMLElement).closest("a, button")) return;
  // Pointer inspection must not latch the keyboard-only focus pause.
  event.preventDefault();
  if (document.activeElement === artwork.value) artwork.value?.blur();
  if (busy.value) return;
  settleTween?.kill();
  settleTween = undefined;
  gesture = { id: event.pointerId, type: event.pointerType, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, startDrag: driver.dragX };
  dragging.value = true;
  artwork.value?.setPointerCapture(event.pointerId);
}

function pointerUp(event: PointerEvent) {
  if (!gesture || event.pointerId !== gesture.id) return;
  const start = gesture;
  const x = event.clientX - start.x;
  const y = event.clientY - start.y;
  clearGesture(event);
  const horizontal = Math.abs(x) > Math.abs(y) * 1.2;
  const distance = start.type === "touch" && !horizontal ? y : x;
  if (Math.abs(distance) > 50 && (horizontal || start.type === "touch") && animator && projects.value.length > 1) {
    changeWork(distance < 0 ? 1 : -1);
  } else {
    if (start.type === "touch" && Math.hypot(x, y) < 12) touchInspect.value = !touchInspect.value;
    settleDrag();
  }
}

function clearGesture(position?: { clientX: number; clientY: number }) {
  const active = gesture;
  if (!active) return;
  // Clear first: releasing capture dispatches lostpointercapture again.
  gesture = undefined;
  if (active.type === "mouse" || active.type === "pen") {
    const bounds = artwork.value?.getBoundingClientRect();
    pointerOver.value = Boolean(position && bounds && position.clientX >= bounds.left && position.clientX <= bounds.right && position.clientY >= bounds.top && position.clientY <= bounds.bottom);
  }
  if (artwork.value?.hasPointerCapture(active.id)) artwork.value.releasePointerCapture(active.id);
  dragging.value = false;
}

function settleDrag() {
  settleTween?.kill();
  if (!animator || disposed) { driver.dragX = 0; syncFrame(); return; }
  settleTween = animator.to(driver, {
    dragX: 0,
    duration: reduced.value ? 0 : 0.35,
    ease: "power3.out",
    onUpdate: syncFrame,
    onComplete: () => { settleTween = undefined; },
  });
}

function cancelGesture(event?: PointerEvent) {
  if (!gesture || (event && event.pointerId !== gesture.id)) return;
  clearGesture();
  settleDrag();
}

function windowBlur() {
  cancelGesture();
  if (menuOpen.value) closeWorksMenu(false);
}

async function openWorksMenu() {
  if (disposed || menuOpen.value) return;
  const animationId = ++menuAnimationId;
  menuTween?.kill();
  menuTween = undefined;
  cancelGesture();
  pointerOver.value = false;
  focusWithin.value = false;
  touchInspect.value = false;
  menuVisible.value = true;
  menuOpen.value = true;
  await nextTick();
  if (disposed || !menuOpen.value || animationId !== menuAnimationId) return;
  const panel = worksMenu.value;
  const items = panel?.querySelectorAll<HTMLButtonElement>(".work-index-item") || [];
  if (!busy.value) items[currentIndex.value]?.focus();
  if (!animator || !panel) return;
  if (reduced.value) {
    animator.set([panel, worksMenuScrim.value], { opacity: 1, y: 0 });
    animator.set(panel, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
    animator.set(items, { opacity: 1, x: 0 });
    return;
  }
  const timeline = animator.timeline();
  menuTween = timeline;
  timeline.fromTo(worksMenuScrim.value, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)
    .fromTo(panel, { opacity: 0, y: -8, clipPath: "polygon(0 0, 36px 0, 0 36px, 0 0)" }, {
      opacity: 1, y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.38, ease: "power3.out",
    }, 0)
    .fromTo(items, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.24, stagger: 0.018, ease: "power2.out" }, 0.08);
}

function closeWorksMenu(restoreFocus = true) {
  if (disposed || !menuVisible.value) return;
  const animationId = ++menuAnimationId;
  menuTween?.kill();
  menuTween = undefined;
  menuOpen.value = false;
  const panel = worksMenu.value;
  if (restoreFocus) worksMenuButton.value?.focus({ preventScroll: true });
  else if (panel?.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
  const complete = () => {
    if (disposed || animationId !== menuAnimationId) return;
    menuVisible.value = false;
    menuTween = undefined;
  };
  if (!animator || !panel || reduced.value) {
    complete();
    return;
  }
  const timeline = animator.timeline({ onComplete: complete });
  menuTween = timeline;
  timeline.to(panel, { opacity: 0, y: -8, duration: 0.2, ease: "power2.in" }, 0)
    .to(worksMenuScrim.value, { opacity: 0, duration: 0.22 }, 0);
}

function toggleWorksMenu() {
  if (menuOpen.value) closeWorksMenu();
  else void openWorksMenu();
}

function selectWork(index: number) {
  if (disposed || busy.value || !projects.value[index]) return;
  closeWorksMenu();
  void goTo(index, index < currentIndex.value ? -1 : 1);
}

function handleMenuKey(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeWorksMenu();
    return;
  }
  if (!menuOpen.value || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const items = Array.from(worksMenu.value?.querySelectorAll<HTMLButtonElement>(".work-index-item") || []);
  if (!items.length) return;
  const index = items.indexOf(document.activeElement as HTMLButtonElement);
  const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
    : event.key === "ArrowDown" ? (index + 1) % items.length : index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
  event.preventDefault();
  items[next]?.focus();
}

function handleMenuFocusOut(event: FocusEvent) {
  if (!menuOpen.value) return;
  const next = event.relatedTarget as Node | null;
  if (next === worksMenuButton.value || (next && worksMenu.value?.contains(next))) return;
  closeWorksMenu(false);
}

function handleTouchMove(event: TouchEvent) {
  if (menuVisible.value && worksMenu.value?.contains(event.target as Node)) return;
  if (event.touches.length === 1) event.preventDefault();
}

function handleFocusOut(event: FocusEvent) {
  focusWithin.value = Boolean(artwork.value?.contains(event.relatedTarget as Node | null));
}

function clearCipher() {
  const canvas = cipherCanvas.value;
  if (canvas && cipherContext) cipherContext.clearRect(0, 0, canvas.width, canvas.height);
}

function resize() {
  stage?.resize();
  const canvas = cipherCanvas.value;
  const bounds = artwork.value?.getBoundingClientRect();
  if (!canvas || !bounds) return;
  canvas.width = Math.round(bounds.width);
  canvas.height = Math.round(bounds.height);
  cipherContext = canvas.getContext("2d");
  syncFrame();
}

function drawCipher(time: number) {
  const frame = Math.floor(time * 12);
  if (frame === lastCipherFrame) return;
  lastCipherFrame = frame;
  clearCipher();
  if (!cipherContext || !cipherCanvas.value || (inspecting.value && !transitioning.value) || reduced.value || tabHidden.value) return;
  // Keep the short corruption lines without drawing text over the artwork.
  if (Math.sin(time * 3.7) < 0.73 && !transitioning.value) return;
  const { width, height } = cipherCanvas.value;
  const envelope = transitioning.value ? Math.sin(driver.transition * Math.PI) : 0;
  const rows = transitioning.value ? Math.ceil(envelope * 12) : 2;
  drawHackerNoise(cipherContext, width, height, {
    frame,
    color: visiblePalette.accent,
    intensity: transitioning.value ? envelope * 0.75 : 0.7,
    rows,
  });
}

function tick(time: number) {
  if (disposed || tabHidden.value) return;
  if (!inspecting.value || busy.value || dragging.value) {
    stage?.setMotion(driver);
    stage?.render(time);
    drawCipher(time);
  }
}

function handleVisibility() {
  tabHidden.value = document.hidden;
  if (document.hidden) cancelGesture();
  if (!document.hidden) resize();
}

onMounted(async () => {
  if (!root.value || !artwork.value) return;
  applyPalette(defaultPalette);
  // A cached SSR image may finish loading before Vue attaches its listener.
  for (const image of artwork.value.querySelectorAll<HTMLImageElement>(".fallback-image")) {
    if (image.complete && image.naturalWidth) rememberPalette(image.getAttribute("src") || "", sampleImageBackground(image));
  }
  const pageElement = root.value;
  pageElement.addEventListener("wheel", handleWheel, { passive: false });
  pageElement.addEventListener("touchmove", handleTouchMove, { passive: false });
  pageElement.addEventListener("pointercancel", cancelGesture);
  window.addEventListener("blur", windowBlur);
  document.addEventListener("keydown", handleKey);
  document.addEventListener("visibilitychange", handleVisibility);
  disposeListeners.push(() => {
    pageElement.removeEventListener("wheel", handleWheel);
    pageElement.removeEventListener("touchmove", handleTouchMove);
    pageElement.removeEventListener("pointercancel", cancelGesture);
    window.removeEventListener("blur", windowBlur);
    document.removeEventListener("keydown", handleKey);
    document.removeEventListener("visibilitychange", handleVisibility);
  });

  if (smoothScroller) stopScrollerWatcher = watch(smoothScroller, (scroller) => scroller?.stop(), { immediate: true });
  driver.reduced = reduced.value;
  handleVisibility();
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(artwork.value);
  resize();

  const { gsap } = await import("gsap");
  if (disposed) return;
  animator = gsap;
  gsap.ticker.add(tick);
  scheduleAutoplay();

  if (!stageHost.value || !current.value) return;
  try {
    const { createDesignStage } = await import("~/utils/design-stage");
    if (disposed || !stageHost.value) return;
    const renderer = await createDesignStage(stageHost.value, () => {
      canvasReady.value = false;
      activeTexture = null;
      stage = undefined;
    });
    if (disposed) { renderer.dispose(); return; }
    stage = renderer;
    const initialIndex = currentIndex.value;
    const initialTexture = await renderer.loadImage(projects.value[initialIndex].image);
    if (disposed) return;
    if (!busy.value && initialIndex === currentIndex.value && initialTexture) {
      rememberPalette(projects.value[initialIndex].image, initialTexture.background);
      activeTexture = initialTexture;
      renderer.setImages(initialTexture);
      renderer.setMotion(driver);
      renderer.render(performance.now() / 1000);
      canvasReady.value = true;
    }
    preloadNext();
  } catch {
    stage?.dispose();
    stage = undefined;
    canvasReady.value = false;
  }
});

onBeforeUnmount(() => {
  disposed = true;
  clearAutoplay();
  clearGesture();
  transitionTween?.kill();
  settleTween?.kill();
  ++menuAnimationId;
  menuTween?.kill();
  driver.transitionFx = 0;
  driver.dragX = 0;
  animator?.ticker.remove(tick);
  resizeObserver?.disconnect();
  disposeListeners.forEach((remove) => remove());
  stopScrollerWatcher?.();
  smoothScroller?.value?.start();
  stage?.dispose();
  for (const [property, previous] of previousBodyStyles) {
    if (previous.value) document.body.style.setProperty(property, previous.value, previous.priority);
    else document.body.style.removeProperty(property);
  }
});
</script>

<template>
  <main
    ref="root"
    class="exhibition"
    :class="{ 'is-inspecting': detailsVisible, 'is-transitioning': transitioning, 'is-dragging': dragging, 'is-reduced': reduced, 'is-index-open': menuVisible }"
    data-lenis-prevent
    @pointermove="pointerMove"
    @pointerdown.self="touchInspect = false"
  >
    <h1 class="sr-only">Design portfolio by ritsu</h1>
    <div class="gallery-backdrop" aria-hidden="true">
      <img v-if="current && !imageFailed" :key="current.id" :src="current.image" alt="" class="backdrop-image" decoding="async" fetchpriority="low" />
      <img v-if="pending" :src="pending.image" alt="" class="backdrop-image backdrop-next" decoding="async" fetchpriority="low" />
    </div>

    <div
      ref="artwork"
      class="artwork"
      :inert="menuVisible"
      tabindex="0"
      role="group"
      :aria-label="current ? `${current.title}, ${positionLabel}. Drag left or right, scroll, or use the arrow keys to change artwork. Focus to show project details.` : 'Design gallery'"
      @pointerenter="pointerEnter"
      @pointerleave="pointerOver = false"
      @pointerdown="pointerDown"
      @pointerup="pointerUp"
      @lostpointercapture="cancelGesture"
      @dragstart.prevent
      @focusin="focusWithin = true"
      @focusout="handleFocusOut"
    >
      <div class="artwork-visuals" aria-hidden="true">
        <div class="fallback-frame">
          <img v-if="current && !imageFailed" :key="current.id" :src="current.image" alt="" class="fallback-image" decoding="async" fetchpriority="high" @load="imageLoaded($event, current.image)" @error="imageFailed = true" />
          <img v-if="pending" :src="pending.image" alt="" class="fallback-image fallback-next" decoding="async" @load="imageLoaded($event, pending.image)" />
          <div v-if="imageFailed || !current" class="unavailable-image"><span aria-hidden="true">×</span></div>
        </div>
        <div ref="stageHost" class="webgl-stage" :class="{ 'is-ready': canvasReady }"></div>
        <canvas ref="cipherCanvas" class="cipher-layer"></canvas>
        <div class="artwork-edges">
          <span class="edge-top"></span><span class="edge-right"></span>
          <span class="edge-bottom"></span><span class="edge-left"></span>
        </div>
      </div>

      <div v-if="current" class="work-details" :aria-hidden="!detailsVisible" :inert="!detailsVisible">
        <div class="detail-meta"><span>{{ current.director }}</span><span>{{ current.year }}</span></div>
        <h2>{{ current.title }}</h2>
        <div class="detail-bottom">
          <span>{{ current.client }}</span>
          <a :href="current.url" target="_blank" rel="noopener noreferrer" class="project-link">View project <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </div>

    <NuxtLink to="/" class="icon-control home-control" :inert="menuVisible" aria-label="Back to home" @pointerenter="pointerOver = false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
    </NuxtLink>

    <button
      ref="worksMenuButton"
      class="icon-control work-index-control"
      type="button"
      :class="{ 'is-open': menuOpen }"
      :aria-expanded="menuOpen"
      aria-controls="design-work-index"
      aria-label="All artworks"
      @click="toggleWorksMenu"
      @focusout="handleMenuFocusOut"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="menu-line menu-line-top" d="M5 7h14" />
        <path class="menu-line menu-line-middle" d="M5 12h14" />
        <path class="menu-line menu-line-bottom" d="M5 17h14" />
      </svg>
    </button>

    <div v-show="menuVisible" ref="worksMenuScrim" class="work-index-scrim" aria-hidden="true" @click="closeWorksMenu(false)"></div>
    <nav
      id="design-work-index"
      v-show="menuVisible"
      ref="worksMenu"
      class="work-index"
      :class="{ 'is-open': menuOpen }"
      :aria-hidden="!menuOpen"
      :inert="!menuOpen"
      aria-label="All artworks"
      data-lenis-prevent
      @focusout="handleMenuFocusOut"
    >
      <div class="work-index-heading"><span>All works</span><span>{{ String(projects.length).padStart(2, '0') }}</span></div>
      <ol>
        <li v-for="(work, index) in projects" :key="work.id">
          <button class="work-index-item" type="button" :disabled="busy" :aria-current="index === currentIndex ? 'true' : undefined" :title="work.title" @click="selectWork(index)">
            <span class="work-index-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="work-index-preview" aria-hidden="true">
              <img v-if="menuVisible" :src="work.image" alt="" width="144" height="88" loading="lazy" decoding="async" draggable="false" />
            </span>
            <span class="work-index-title">{{ work.title }}</span>
            <span class="work-index-year">{{ work.year }}</span>
          </button>
        </li>
      </ol>
    </nav>

    <nav class="gallery-controls" :inert="menuVisible" aria-label="Artwork controls">
      <button class="icon-control" type="button" aria-label="Previous artwork" :disabled="busy" @click="changeWork(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
      <button class="icon-control playback-control" type="button" :aria-label="manuallyPaused ? 'Resume automatic playback' : 'Pause automatic playback'" :aria-pressed="manuallyPaused" @click="manuallyPaused = !manuallyPaused"><svg v-if="manuallyPaused" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" /></svg><svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg></button>
      <button class="icon-control" type="button" aria-label="Next artwork" :disabled="busy" @click="changeWork(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
    </nav>

    <div class="position-indicator" aria-hidden="true"><span :style="{ transform: `scaleX(${projects.length ? (currentIndex + 1) / projects.length : 0})` }"></span></div>
    <p v-if="!current" class="empty-details">No work available. <NuxtLink to="/">Return home ↗</NuxtLink></p>
  </main>
</template>

<style scoped lang="scss">
:global(body.design-exhibition) {
  --gallery-bg: #050606;
  --gallery-rgb: 5, 6, 6;
  --gallery-ink: #ffffff;
  --gallery-ink-rgb: 255, 255, 255;
  --gallery-muted: #bfc1c1;
  --gallery-line: #373838;
  --gallery-accent: #38e7cd;
  overflow: hidden;
  overscroll-behavior: none;
  background: var(--gallery-bg);
}
:global(.design-exhibition #app > .scanline) { display: none; }

.exhibition {
  --accent: var(--gallery-accent);
  --mix: 0;
  position: fixed;
  inset: 0 var(--site-menu-width, 0px) var(--site-menu-height, 0px) 0;
  overflow: hidden;
  isolation: isolate;
  background: var(--gallery-bg);
  color: var(--gallery-ink);
  touch-action: pinch-zoom;
  overscroll-behavior: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  *, *::before, *::after { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
}
.exhibition.is-index-open { touch-action: pan-y pinch-zoom; }

.gallery-backdrop {
  position: absolute;
  inset: -64px;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  .backdrop-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.16);
    filter: blur(18px) saturate(0.65);
  }
  .backdrop-next { opacity: var(--mix); }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    // Keep the enlarged copy quiet, with extra tint behind the controls.
    background: linear-gradient(to bottom, rgba(var(--gallery-rgb), 0.86), rgba(var(--gallery-rgb), 0.56) 22%, rgba(var(--gallery-rgb), 0.7) 42%, rgba(var(--gallery-rgb), 0.7) 58%, rgba(var(--gallery-rgb), 0.56) 78%, rgba(var(--gallery-rgb), 0.86));
  }
}

.artwork {
  --edge-y: clamp(28px, 11%, 120px);
  --edge-x: clamp(20px, 5%, 88px);
  --edge-blur: 5px;
  position: absolute;
  z-index: 1;
  inset: 5.5vh 4vw 7vh;
  overflow: hidden;
  outline: none;
  isolation: isolate;
  cursor: grab;
  user-select: none;
  &::before, &::after { content: ""; position: absolute; width: 20px; height: 20px; z-index: 6; pointer-events: none; opacity: 0.45; }
  &::before { top: 16px; left: 16px; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
  &::after { bottom: 16px; right: 16px; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }
  &:focus-visible { outline: 1px solid var(--accent); outline-offset: 5px; }
}
.is-dragging .artwork { cursor: grabbing; }

.artwork-visuals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--gallery-bg);
  // Fade only the image layers into the enlarged copy, preserving details
  // and focus decorations outside this mask.
  -webkit-mask-image: linear-gradient(to right, transparent, #000 var(--edge-x), #000 calc(100% - var(--edge-x)), transparent), linear-gradient(to bottom, transparent, #000 var(--edge-y), #000 calc(100% - var(--edge-y)), transparent);
  mask-image: linear-gradient(to right, transparent, #000 var(--edge-x), #000 calc(100% - var(--edge-x)), transparent), linear-gradient(to bottom, transparent, #000 var(--edge-y), #000 calc(100% - var(--edge-y)), transparent);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
.fallback-frame, .webgl-stage, .cipher-layer { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.fallback-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.fallback-next { opacity: var(--mix); }
.webgl-stage { opacity: 0; &.is-ready { opacity: 1; } }
.cipher-layer { z-index: 2; }
.is-inspecting:not(.is-transitioning) .cipher-layer, .is-reduced .cipher-layer { visibility: hidden; }
.artwork-edges {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  // Only the narrow perimeter is filtered; the central artwork stays sharp.
  span {
    position: absolute;
    pointer-events: none;
    background: linear-gradient(var(--edge-direction), rgba(var(--gallery-rgb), 1), rgba(var(--gallery-rgb), 0.88) 14%, rgba(var(--gallery-rgb), 0.34) 46%, rgba(var(--gallery-rgb), 0));
    -webkit-backdrop-filter: blur(var(--edge-blur));
    backdrop-filter: blur(var(--edge-blur));
    -webkit-mask-image: linear-gradient(var(--edge-direction), #000 24%, transparent);
    mask-image: linear-gradient(var(--edge-direction), #000 24%, transparent);
  }
  .edge-top, .edge-bottom { left: 0; right: 0; height: var(--edge-y); }
  .edge-left, .edge-right { top: 0; bottom: 0; width: var(--edge-x); }
  .edge-top { --edge-direction: to bottom; top: 0; }
  .edge-right { --edge-direction: to left; right: 0; }
  .edge-bottom { --edge-direction: to top; bottom: 0; }
  .edge-left { --edge-direction: to right; left: 0; }
}
.unavailable-image { display: grid; place-items: center; height: 100%; color: var(--accent); background: var(--gallery-bg); font-size: 72px; font-weight: 200; }

.work-details {
  position: absolute;
  inset: auto 0 0;
  z-index: 5;
  padding: clamp(24px, 3.2vw, 56px);
  background: linear-gradient(transparent, rgba(var(--gallery-rgb), 0.9) 50%, rgba(var(--gallery-rgb), 0.98));
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.25s ease, transform 0.35s ease;
  pointer-events: none;
  h2 { margin: 18px 0 22px; font-family: Arial, sans-serif; font-size: clamp(28px, 4vw, 64px); line-height: 1.04; letter-spacing: -0.045em; font-weight: 400; overflow-wrap: anywhere; }
}
.is-inspecting .work-details { opacity: 1; transform: none; pointer-events: auto; }
.detail-meta, .detail-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 11px; }
.detail-meta { color: var(--accent); }
.detail-bottom > span { color: var(--gallery-muted); }
.project-link { display: inline-flex; align-items: center; gap: 28px; min-height: 44px; border-bottom: 1px solid var(--gallery-line); font-size: 11px; }
.project-link:hover { color: var(--accent); border-color: var(--accent); }
.project-link span[aria-hidden] { font-size: 20px; }
.icon-control {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--gallery-ink);
  cursor: pointer;
  transition: color 0.2s ease;
  svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.3; }
  &:hover { color: var(--accent); }
  &:disabled { opacity: 0.3; cursor: default; }
}
.home-control { position: absolute; top: max(4px, env(safe-area-inset-top)); left: calc(4vw - 13px); z-index: 8; }
.work-index-control {
  position: absolute;
  top: max(4px, env(safe-area-inset-top));
  left: calc(4vw + 35px);
  z-index: 14;
  svg { width: 18px; height: 18px; }
  .menu-line { transform-box: view-box; transform-origin: 12px 12px; transition: transform 0.24s ease, opacity 0.18s ease; }
  &.is-open { color: var(--accent); }
  &.is-open .menu-line-top { transform: rotate(45deg) translateY(5px); }
  &.is-open .menu-line-middle { opacity: 0; transform: scaleX(0.4); }
  &.is-open .menu-line-bottom { transform: rotate(-45deg) translateY(-5px); }
}
.work-index-scrim { position: absolute; inset: 0; z-index: 12; background: rgba(var(--gallery-rgb), 0.3); }
.work-index {
  position: absolute;
  z-index: 13;
  top: calc(max(4px, env(safe-area-inset-top)) + 52px);
  left: 4vw;
  width: min(440px, 92vw);
  max-height: calc(100dvh - var(--site-menu-height, 0px) - max(4px, env(safe-area-inset-top)) - 80px);
  overflow-y: auto;
  overscroll-behavior: contain;
  touch-action: pan-y pinch-zoom;
  padding: 16px 18px 14px;
  background: rgba(var(--gallery-rgb), 0.97);
  color: var(--gallery-ink);
  border: 1px solid var(--gallery-line);
  border-top-color: var(--accent);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
  scrollbar-width: thin;
  scrollbar-color: var(--gallery-line) transparent;
  &:not(.is-open) { pointer-events: none; }
  ol { list-style: none; padding: 0; margin: 0; }
}
.work-index-heading { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--gallery-line); color: var(--accent); font-size: 10px; letter-spacing: 0.08em; }
.work-index-item {
  display: grid;
  grid-template-columns: 22px 72px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 56px;
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  &:hover, &[aria-current="true"] { color: var(--accent); background: rgba(var(--gallery-ink-rgb), 0.04); }
  &:focus-visible { outline: 1px solid var(--accent); outline-offset: 0; }
  &:disabled { opacity: 0.4; cursor: default; }
}
.work-index-number, .work-index-year { opacity: 0.65; font-size: 10px; font-variant-numeric: tabular-nums; }
.work-index-preview {
  display: grid;
  place-items: center;
  width: 72px;
  height: 44px;
  overflow: hidden;
  background: rgba(var(--gallery-ink-rgb), 0.05);
  border: 1px solid var(--gallery-line);
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
}
.work-index-item[aria-current="true"] .work-index-preview { border-color: var(--accent); }
.work-index-title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; line-height: 1.3; }
.gallery-controls { display: flex; position: absolute; bottom: max(2px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); gap: 16px; z-index: 8; }
.playback-control svg { width: 14px; height: 14px; }
.position-indicator { position: absolute; z-index: 8; left: 4vw; right: 4vw; bottom: 0; height: 1px; overflow: hidden; background: var(--gallery-line); pointer-events: none; span { display: block; height: 100%; background: var(--accent); transform-origin: left; transition: transform 0.5s ease; } }
.project-link:focus-visible, .icon-control:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; }
.empty-details { position: absolute; z-index: 1; top: 45%; width: 100%; text-align: center; font-size: 12px; a { display: block; padding: 20px; color: var(--accent); } }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

@media (max-width: 700px) {
  .gallery-backdrop { inset: -48px; .backdrop-image { filter: blur(12px) saturate(0.65); } }
  .artwork { --edge-y: clamp(22px, 10%, 44px); --edge-x: clamp(12px, 4%, 24px); --edge-blur: 3px; inset: auto 0; top: 50%; height: min(72dvh, 88vw); transform: translateY(-50%); }
  .artwork::before { top: 12px; left: 12px; }
  .artwork::after { bottom: 12px; right: 12px; }
  .home-control { top: max(16px, env(safe-area-inset-top)); left: 12px; }
  .work-index-control { top: max(16px, env(safe-area-inset-top)); left: 60px; }
  .work-index { top: calc(max(16px, env(safe-area-inset-top)) + 52px); left: 12px; width: calc(100% - 24px); max-height: calc(100dvh - var(--site-menu-height, 0px) - max(16px, env(safe-area-inset-top)) - 80px); padding: 12px 14px; }
  .work-index-heading { margin-bottom: 8px; padding-bottom: 10px; }
  .work-index-item { grid-template-columns: 20px 64px minmax(0, 1fr) auto; min-height: 50px; padding: 5px 0; gap: 7px; }
  .work-index-preview { width: 64px; height: 40px; }
  .gallery-controls { bottom: max(24px, env(safe-area-inset-bottom)); gap: 28px; }
  .work-details { padding: 24px 24px 20px; }
  .work-details h2 { margin: 14px 0; font-size: 30px; }
  .detail-meta, .detail-bottom, .project-link { font-size: 10px; }
  .detail-bottom { align-items: end; }
  .detail-bottom > span { max-width: 44%; line-height: 1.6; }
  .project-link { gap: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .work-details, .icon-control, .work-index-control .menu-line, .position-indicator span { transition: none; }
}
</style>
