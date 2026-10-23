<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useId } from "#imports";
import { select, zoom, zoomIdentity } from "d3";
import { layoutFlow } from "~/utils/content-flow";
import type { FlowEdge, FlowGraph, PositionedFlowNode } from "~/utils/content-flow";
import { displayText } from "~/utils/display-text";

const props = defineProps<{ graph: FlowGraph; title: string; height: string | number }>();
const id = useId();
const figure = ref<HTMLElement | null>(null);
const viewportElement = ref<HTMLElement | null>(null);
const svg = ref<SVGSVGElement | null>(null);
const scene = ref<SVGGElement | null>(null);
const fullscreenButton = ref<HTMLButtonElement | null>(null);
const selectedId = ref("");
const hoveredId = ref("");
const desktopInput = ref(false);
const wheelActive = ref(false);
const dragging = ref(false);
const focusedId = ref("");
const fullscreen = ref(false);
const fullscreenAvailable = ref(false);
const fullscreenError = ref("");
const scalePercentage = ref(100);
const height = computed(() => {
  const value = Number(props.height);
  return Number.isFinite(value) ? Math.max(320, Math.min(value, 1000)) : 520;
});
const viewport = ref({ width: 960, height: height.value });
const layout = computed(() => layoutFlow(props.graph));
const nodesById = computed(() => new Map(layout.value.nodes.map(node => [node.id, node])));
const edgesByNode = computed(() => {
  const index = new Map<string, FlowEdge[]>();
  for (const edge of props.graph.edges) {
    const source = index.get(edge.source) || [];
    source.push(edge);
    index.set(edge.source, source);
    if (edge.target !== edge.source) {
      const target = index.get(edge.target) || [];
      target.push(edge);
      index.set(edge.target, target);
    }
  }
  return index;
});
const startingNode = computed(() => {
  const targets = new Set(props.graph.edges.map(edge => edge.target));
  return layout.value.nodes.find(node => !targets.has(node.id)) || layout.value.nodes[0];
});
const selectedNode = computed(() => nodesById.value.get(selectedId.value));
const incidentEdges = computed(() => edgesByNode.value.get(selectedId.value) || []);
// Hover previews a neighborhood without replacing the pinned detail panel.
const highlightedId = computed(() => hoveredId.value || selectedId.value);
const highlightedEdges = computed(() => edgesByNode.value.get(highlightedId.value) || []);
const activeEdges = computed(() => new Set(highlightedEdges.value.map(edge => edge.id)));
const relatedNodes = computed(() => new Set([highlightedId.value, ...highlightedEdges.value.flatMap(edge => [edge.source, edge.target])]));
const kindLabels: Record<string, string> = { origin: "起点", goal: "目标", intent: "意图", fact: "事实", finding: "发现", digest: "摘要", note: "节点" };
const statusLabels: Record<string, string> = { open: "待处理", pending: "待处理", active: "进行中", confirmed: "已确认", done: "已完成", blocked: "已阻塞", exhausted: "预算耗尽", stopped: "已停止", met: "已达成", origin: "起点" };
const labelFor = (labels: Record<string, string>, value: string) => displayText(Object.prototype.hasOwnProperty.call(labels, value) ? labels[value] : value);
const kindLabel = (value: string) => labelFor(kindLabels, value) || "节点";
const kindColor = (value: string) => `var(--flow-${Object.prototype.hasOwnProperty.call(kindLabels, value) ? value : 'note'})`;
const statusLabel = (value: string) => labelFor(statusLabels, value);
const kinds = computed(() => [...new Set(props.graph.nodes.map(node => node.kind))].map(kind => ({ kind, label: kindLabel(kind), color: kindColor(kind) })));

interface View { x: number; y: number; k: number }
function fittedView(): View {
  const graph = layout.value;
  const k = Math.max(0.002, Math.min(1, (viewport.value.width - 48) / Math.max(graph.width, 1), (viewport.value.height - 48) / Math.max(graph.height, 1)));
  return { x: (viewport.value.width - graph.width * k) / 2, y: (viewport.value.height - graph.height * k) / 2, k };
}
function startingView(): View {
  const fit = fittedView();
  if (fit.k >= 0.55 || !layout.value.nodes.length) return fit;
  const root = startingNode.value;
  const k = Math.min(0.8, Math.max(0.55, (viewport.value.width - 48) / (layout.value.nodeWidth * 2.6)));
  return { x: 24 - root.x * k, y: viewport.value.height / 2 - (root.y + layout.value.nodeHeight / 2) * k, k };
}
const initialView = startingView();
scalePercentage.value = Math.max(1, Math.round(initialView.k * 100));
const viewString = (view: View) => `translate(${view.x},${view.y}) scale(${view.k})`;
const initialTransform = viewString(initialView);
let currentView: View = initialView;
let zoomBehavior: ReturnType<typeof zoom> | undefined;
let observer: ResizeObserver | undefined;
let frame: number | undefined;
let pendingView: View = currentView;
let measured = false;
let scaleTimer: ReturnType<typeof setTimeout> | undefined;
let inputMedia: MediaQueryList | undefined;
let wheelHoverTimer: ReturnType<typeof setTimeout> | undefined;
let pointerInside = false;

function resetWheelHover() {
  if (wheelHoverTimer !== undefined) clearTimeout(wheelHoverTimer);
  wheelHoverTimer = undefined;
  pointerInside = false;
  wheelActive.value = false;
}
function scheduleWheelCapture() {
  if (wheelActive.value || wheelHoverTimer !== undefined || !pointerInside || !desktopInput.value || !props.graph.nodes.length) return;
  wheelHoverTimer = setTimeout(() => {
    wheelHoverTimer = undefined;
    wheelActive.value = true;
  }, 1_300);
}
function syncWheelHover() {
  // Hydration and window focus can happen with the mouse already over the graph.
  if (!desktopInput.value || !document.hasFocus() || !figure.value?.matches(":hover")) {
    resetWheelHover();
    return;
  }
  pointerInside = true;
  scheduleWheelCapture();
}
function beginWheelHover(event: PointerEvent) {
  if (event.pointerType === "touch") { resetWheelHover(); return; }
  if (!desktopInput.value) return;
  pointerInside = true;
  scheduleWheelCapture();
}

function syncInputMode() {
  desktopInput.value = Boolean(inputMedia?.matches);
  resetWheelHover();
  figure.value?.removeEventListener("wheel", handleWheel);
  if (desktopInput.value) figure.value?.addEventListener("wheel", handleWheel, { passive: false });
  resetPointerGesture();
  syncWheelHover();
}

interface CanvasGesture {
  pointerId: number;
  x: number;
  y: number;
  startedAt: number;
  maxDistance2: number;
  nodeId: string;
  blank: boolean;
  invalid: boolean;
}
interface CompletedGesture {
  endedAt: number;
  valid: boolean;
  nodeId: string;
  blank: boolean;
}
let pointerGesture: CanvasGesture | undefined;
let completedGesture: CompletedGesture | undefined;
function nodeAt(target: EventTarget | null) {
  return (target as Element)?.closest?.("[data-flow-node]")?.getAttribute("data-flow-node") || "";
}
function isCanvasBackground(target: EventTarget | null) {
  const element = target as Element;
  return target === viewportElement.value || Boolean(svg.value && element?.closest?.(".flow-svg") === svg.value && !element.closest(".flow-node"));
}
function stopPointerTracking() {
  window.removeEventListener("pointermove", handlePointerMove, true);
  window.removeEventListener("pointerup", handlePointerUp, true);
  window.removeEventListener("pointercancel", handlePointerCancel, true);
  window.removeEventListener("blur", resetPointerGesture);
}
function resetPointerGesture() {
  if (pointerGesture) stopPointerTracking();
  pointerGesture = undefined;
  completedGesture = undefined;
  dragging.value = false;
  hoveredId.value = "";
}
function handlePointerDown(event: PointerEvent) {
  completedGesture = undefined;
  if (pointerGesture) {
    pointerGesture.invalid = true;
    hoveredId.value = "";
    return;
  }
  if (!props.graph.nodes.length || event.button !== 0 || event.isPrimary === false) return;
  pointerGesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startedAt: event.timeStamp, maxDistance2: 0, nodeId: nodeAt(event.target), blank: isCanvasBackground(event.target), invalid: false };
  // D3 captures mouseup itself. Pointer events also cover touch, releases outside
  // the canvas, and long presses without changing button targets via capture.
  window.addEventListener("pointermove", handlePointerMove, true);
  window.addEventListener("pointerup", handlePointerUp, true);
  window.addEventListener("pointercancel", handlePointerCancel, true);
  window.addEventListener("blur", resetPointerGesture);
}
function handlePointerMove(event: PointerEvent) {
  const gesture = pointerGesture;
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  gesture.maxDistance2 = Math.max(gesture.maxDistance2, (event.clientX - gesture.x) ** 2 + (event.clientY - gesture.y) ** 2);
  if (gesture.maxDistance2 > 25 && !dragging.value) {
    dragging.value = true;
    hoveredId.value = "";
  }
}
function handlePointerUp(event: PointerEvent) {
  const gesture = pointerGesture;
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  handlePointerMove(event);
  completedGesture = {
    endedAt: event.timeStamp,
    valid: !gesture.invalid && gesture.maxDistance2 <= 25 && event.timeStamp - gesture.startedAt < 450,
    nodeId: gesture.nodeId === nodeAt(event.target) ? gesture.nodeId : "",
    blank: gesture.blank && isCanvasBackground(event.target),
  };
  stopPointerTracking();
  pointerGesture = undefined;
  dragging.value = false;
}
function handlePointerCancel() { resetPointerGesture(); }
function consumeClick(event: MouseEvent) {
  const gesture = completedGesture;
  completedGesture = undefined;
  return gesture?.valid && event.timeStamp >= gesture.endedAt && event.timeStamp - gesture.endedAt < 800 ? gesture : undefined;
}
function handleCanvasClick(event: MouseEvent) {
  if (!isCanvasBackground(event.target) || !consumeClick(event)?.blank) return;
  clearSelection();
  svg.value?.focus({ preventScroll: true });
}
function handleNodeClick(event: MouseEvent, nodeId: string) {
  const gesture = consumeClick(event);
  if (event.detail === 0 || gesture?.nodeId === nodeId) selectNode(nodeId);
}
function previewNode(event: PointerEvent, nodeId: string) {
  if (desktopInput.value && event.pointerType !== "touch" && !pointerGesture && !dragging.value) hoveredId.value = nodeId;
}
function leaveNode(nodeId: string) {
  if (hoveredId.value === nodeId) hoveredId.value = "";
}
function clearSelection() {
  selectedId.value = "";
  hoveredId.value = "";
}
function handleEscape(event: KeyboardEvent) {
  if (event.key !== "Escape" || (!selectedId.value && !hoveredId.value)) return;
  event.preventDefault();
  event.stopPropagation();
  clearSelection();
  svg.value?.focus({ preventScroll: true });
}

function applyView(view: View, immediate = true) {
  if (!svg.value || !zoomBehavior) return;
  select(svg.value).call(zoomBehavior.transform, zoomIdentity.translate(view.x, view.y).scale(view.k));
  if (immediate) scene.value?.setAttribute("transform", viewString(view));
}
function fit() { applyView(fittedView()); }
function reset() { applyView(startingView()); }
function zoomBy(factor: number) {
  if (svg.value && zoomBehavior) select(svg.value).call(zoomBehavior.scaleBy, factor);
}
function actualSize() { zoomBy(1 / currentView.k); }
function handleWheel(event: WheelEvent) {
  if (!desktopInput.value || !props.graph.nodes.length || !svg.value || !zoomBehavior) return;
  if (!wheelActive.value) {
    // A wheel attempt must not restart the dwell timer or require pointer movement.
    pointerInside = true;
    scheduleWheelCapture();
    return;
  }
  // Once activated, detail/list panels keep their own native scrolling.
  if ((event.target as Element)?.closest?.(".flow-inspector, .flow-outline-list")) return;
  if (pointerGesture) pointerGesture.invalid = true;
  completedGesture = undefined;
  if (event.cancelable) event.preventDefault();
  event.stopPropagation();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.value.height : 1;
  const dx = event.deltaX * unit;
  const dy = event.deltaY * unit;
  const pinch = event.ctrlKey || event.metaKey;
  if (!pinch && (event.shiftKey || event.altKey || Math.abs(dx) > Math.abs(dy))) {
    const x = event.shiftKey ? dx || dy : dx;
    const y = event.shiftKey ? 0 : dy;
    applyView({ ...currentView, x: currentView.x - x, y: currentView.y - y }, false);
    return;
  }
  const rect = svg.value.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.left + rect.width && event.clientY >= rect.top && event.clientY <= rect.top + rect.height;
  const anchor: [number, number] = inside ? [event.clientX - rect.left, event.clientY - rect.top] : [viewport.value.width / 2, viewport.value.height / 2];
  const factor = 2 ** (-Math.max(-240, Math.min(240, dy)) * (event.ctrlKey ? 0.01 : 0.002));
  select(svg.value).call(zoomBehavior.scaleBy, factor, anchor);
}
function focusNode(nodeId: string) {
  const node = nodesById.value.get(nodeId);
  if (!node) return;
  focusedId.value = nodeId;
  const k = Math.max(0.8, currentView.k);
  applyView({ x: viewport.value.width / 2 - (node.x + layout.value.nodeWidth / 2) * k, y: viewport.value.height / 2 - (node.y + layout.value.nodeHeight / 2) * k, k });
  void nextTick(() => {
    [...(svg.value?.querySelectorAll<HTMLButtonElement>("button[data-flow-node]") || [])].find(button => button.dataset.flowNode === nodeId)?.focus({ preventScroll: true });
  });
}
function selectNode(nodeId: string, navigate = false) {
  selectedId.value = nodeId;
  focusedId.value = nodeId;
  if (navigate) focusNode(nodeId);
}
function closeDetails() {
  const previous = selectedId.value;
  clearSelection();
  void nextTick(() => {
    [...(svg.value?.querySelectorAll<HTMLButtonElement>("button[data-flow-node]") || [])].find(button => button.dataset.flowNode === previous)?.focus({ preventScroll: true });
  });
}
function handleNodeKeydown(event: KeyboardEvent, node: PositionedFlowNode) {
  const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  const direction = Object.prototype.hasOwnProperty.call(directions, event.key) ? directions[event.key] : undefined;
  if (!direction) return;
  event.preventDefault();
  event.stopPropagation();
  const [dx, dy] = direction;
  const candidates = layout.value.nodes.filter(other => (other.x - node.x) * dx + (other.y - node.y) * dy > 0);
  const score = (other: PositionedFlowNode) => Math.abs((other.x - node.x) * dx + (other.y - node.y) * dy) + 3 * Math.abs((other.x - node.x) * dy + (other.y - node.y) * dx);
  candidates.sort((a, b) => score(a) - score(b));
  if (candidates[0]) focusNode(candidates[0].id);
}
function handleCanvasKeydown(event: KeyboardEvent) {
  if (event.target !== svg.value) return;
  const pans: Record<string, [number, number]> = { ArrowLeft: [64, 0], ArrowRight: [-64, 0], ArrowUp: [0, 64], ArrowDown: [0, -64] };
  if (Object.prototype.hasOwnProperty.call(pans, event.key)) {
    event.preventDefault();
    const [x, y] = pans[event.key];
    applyView({ ...currentView, x: currentView.x + x, y: currentView.y + y });
  } else if (["+", "=", "-", "0", "Home", "Escape"].includes(event.key)) {
    event.preventDefault();
    if (event.key === "+" || event.key === "=") zoomBy(1.25);
    else if (event.key === "-") zoomBy(0.8);
    else if (event.key === "Escape") clearSelection();
    else if (event.key === "Home") reset();
    else fit();
  }
}
async function toggleFullscreen() {
  fullscreenError.value = "";
  try {
    if (document.fullscreenElement === figure.value) await document.exitFullscreen();
    else await figure.value?.requestFullscreen();
  } catch { fullscreenError.value = "暂时无法进入全屏，可使用缩放和拖拽浏览。"; }
}
function syncFullscreen() {
  const wasFullscreen = fullscreen.value;
  fullscreen.value = document.fullscreenElement === figure.value;
  if (wasFullscreen && !fullscreen.value) fullscreenButton.value?.focus({ preventScroll: true });
}
function measure() {
  const rect = viewportElement.value?.getBoundingClientRect();
  if (!rect || rect.width < 1 || rect.height < 1) return;
  if (!measured) {
    measured = true;
    viewport.value = { width: rect.width, height: rect.height };
    reset();
    return;
  }
  if (Math.abs(rect.width - viewport.value.width) < 1 && Math.abs(rect.height - viewport.value.height) < 1) return;
  const previous = viewport.value;
  viewport.value = { width: rect.width, height: rect.height };
  // Opening the inspector in fullscreen changes the canvas size; keep its visual center.
  applyView({ ...currentView, x: currentView.x + (rect.width - previous.width) / 2, y: currentView.y + (rect.height - previous.height) / 2 });
}

watch(layout, () => {
  clearSelection();
  resetPointerGesture();
  resetWheelHover();
  focusedId.value = "";
  void nextTick(() => { reset(); syncWheelHover(); });
});
onMounted(() => {
  if (!svg.value) return;
  fullscreenAvailable.value = Boolean(document.fullscreenEnabled && figure.value?.requestFullscreen);
  zoomBehavior = zoom()
    .scaleExtent([0.002, 2.5])
    .extent(() => [[0, 0], [viewport.value.width, viewport.value.height]])
    .clickDistance(5)
    // Touch scrolling belongs to the article; graph controls remain tappable.
    .touchable(false)
    .filter(event => {
      if (!desktopInput.value || event.type === "wheel" || event.type === "touchstart") return false;
      if (event.type === "dblclick" || event.button) return false;
      return !((event.target as Element)?.closest?.("button, a, input, select, textarea"));
    })
    .on("zoom.flow", event => {
      currentView = event.transform;
      pendingView = currentView;
      // Transform one SVG group; node data and Vue renders stay idle while dragging.
      if (frame === undefined) frame = requestAnimationFrame(() => {
        scene.value?.setAttribute("transform", viewString(pendingView));
        frame = undefined;
      });
    })
    .on("end.flow", () => {
      // Wheel transforms emit an end event each time; update Vue only after the gesture settles.
      if (scaleTimer !== undefined) clearTimeout(scaleTimer);
      scaleTimer = setTimeout(() => {
        scalePercentage.value = Math.max(1, Math.round(currentView.k * 100));
        scaleTimer = undefined;
      }, 120);
    });
  select(svg.value).call(zoomBehavior).on("dblclick.zoom", null).on("wheel.zoom", null);
  inputMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
  syncInputMode();
  inputMedia.addEventListener("change", syncInputMode);
  measure();
  reset();
  observer = new ResizeObserver(measure);
  if (viewportElement.value) observer.observe(viewportElement.value);
  document.addEventListener("fullscreenchange", syncFullscreen);
  window.addEventListener("blur", resetWheelHover);
  window.addEventListener("focus", syncWheelHover);
});
onBeforeUnmount(() => {
  resetPointerGesture();
  resetWheelHover();
  observer?.disconnect();
  if (frame !== undefined) cancelAnimationFrame(frame);
  if (scaleTimer !== undefined) clearTimeout(scaleTimer);
  figure.value?.removeEventListener("wheel", handleWheel);
  inputMedia?.removeEventListener("change", syncInputMode);
  if (svg.value) select(svg.value).on(".zoom", null);
  document.removeEventListener("fullscreenchange", syncFullscreen);
  window.removeEventListener("blur", resetWheelHover);
  window.removeEventListener("focus", syncWheelHover);
  if (document.fullscreenElement === figure.value) void document.exitFullscreen().catch(() => {});
});
</script>

<template>
  <figure ref="figure" class="content-flow" :class="{ 'is-wheel-pending': desktopInput && !wheelActive }" :style="{ '--flow-height': `${height}px` }" :data-lenis-prevent="wheelActive ? '' : undefined" @pointerenter="beginWheelHover" @pointermove="beginWheelHover" @pointerleave="resetWheelHover" @keydown.capture="handleEscape">
    <header class="flow-toolbar">
      <div class="flow-heading"><span aria-hidden="true">&gt;</span><span>{{ displayText(title) }}</span><span class="flow-count">{{ graph.nodes.length }} 节点 / {{ graph.edges.length }} 关系</span></div>
      <div v-if="graph.nodes.length" class="flow-tools" role="group" aria-label="流程图视图控制">
        <button type="button" aria-label="缩小流程图" title="缩小" @click="zoomBy(0.8)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12" /></svg></button>
        <button type="button" :aria-label="`当前缩放 ${scalePercentage}%，恢复 100%`" :title="`100%（当前 ${scalePercentage}%）`" @click="actualSize"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" /><path d="M7 7v6M13 7v6" /><circle cx="10" cy="8" r="0.6" fill="currentColor" stroke="none" /><circle cx="10" cy="12" r="0.6" fill="currentColor" stroke="none" /></svg></button>
        <button type="button" aria-label="放大流程图" title="放大" @click="zoomBy(1.25)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" /></svg></button>
        <button type="button" aria-label="适配全部节点" title="适配全部" @click="fit"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4" /><rect x="7" y="7" width="6" height="6" /></svg></button>
        <button type="button" aria-label="返回流程起点" title="返回起点" @click="reset"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 17V3m0 1h10l-3 4 3 4H5" /></svg></button>
        <button v-if="fullscreenAvailable" ref="fullscreenButton" type="button" :aria-label="fullscreen ? '退出全屏' : '全屏查看'" :title="fullscreen ? '退出全屏' : '全屏查看'" :aria-pressed="fullscreen" @click="toggleFullscreen"><svg viewBox="0 0 20 20" aria-hidden="true"><path v-if="fullscreen" d="M3 7h4V3M13 3v4h4M17 13h-4v4M7 17v-4H3" /><path v-else d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4" /></svg></button>
      </div>
    </header>

      <div ref="viewportElement" class="flow-viewport" :class="{ 'is-empty': !graph.nodes.length, 'is-dragging': dragging }" @pointerdown.capture="handlePointerDown" @click="handleCanvasClick">
        <svg ref="svg" class="flow-svg" width="100%" height="100%" role="group" :aria-hidden="!graph.nodes.length || undefined" :aria-label="`${displayText(title)}，可交互流程图`" :aria-describedby="graph.nodes.length ? `${id}-help` : undefined" :tabindex="graph.nodes.length ? 0 : -1" @keydown="handleCanvasKeydown">
          <defs>
            <marker :id="`${id}-arrow`" viewBox="0 -4 7 8" refX="6" refY="0" markerWidth="7" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,-3 L6,0 L0,3" class="flow-arrow" /></marker>
            <marker :id="`${id}-active-arrow`" viewBox="0 -4 7 8" refX="6" refY="0" markerWidth="7" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,-3 L6,0 L0,3" class="flow-arrow is-active" /></marker>
          </defs>
          <g ref="scene" :transform="initialTransform">
            <g class="flow-edges" aria-hidden="true">
              <path v-for="edge in layout.edges" :key="edge.id" :d="edge.path" class="flow-edge" :class="{ 'is-active': activeEdges.has(edge.id), 'is-muted': highlightedId && !activeEdges.has(edge.id), 'is-summary': edge.kind === 'covers' }" :marker-end="`url(#${id}-${activeEdges.has(edge.id) ? 'active-arrow' : 'arrow'})`" />
              <template v-for="edge in layout.edges" :key="`label:${edge.id}`">
                <g v-if="edge.label" class="flow-edge-label" :class="{ 'is-active': activeEdges.has(edge.id), 'is-muted': highlightedId && !activeEdges.has(edge.id) }" :transform="`translate(${edge.labelX},${edge.labelY})`">
                  <rect :x="-edge.labelWidth / 2" :y="-edge.labelHeight / 2" :width="edge.labelWidth" :height="edge.labelHeight" />
                  <text>{{ displayText(edge.label.slice(0, 18)) }}</text>
                </g>
              </template>
            </g>
            <foreignObject v-for="node in layout.nodes" :key="node.id" :x="node.x" :y="node.y" :width="layout.nodeWidth" :height="layout.nodeHeight" class="flow-node" :style="{ '--flow-kind': kindColor(node.kind) }" :class="{ 'is-selected': selectedId === node.id, 'is-highlighted': highlightedId === node.id, 'is-related': highlightedId && relatedNodes.has(node.id), 'is-muted': highlightedId && !relatedNodes.has(node.id) }">
              <div xmlns="http://www.w3.org/1999/xhtml" class="flow-node-shell">
                <button type="button" class="flow-node-card" :data-flow-node="node.id" :tabindex="node.id === (focusedId || startingNode?.id) ? 0 : -1" :aria-pressed="selectedId === node.id" :aria-controls="selectedId === node.id ? `${id}-details` : undefined" :aria-label="`查看${kindLabel(node.kind)} ${displayText(node.id)}：${displayText(node.label)}`" @pointerenter="previewNode($event, node.id)" @pointerleave="leaveNode(node.id)" @click="handleNodeClick($event, node.id)" @keydown="handleNodeKeydown($event, node)">
                  <span class="flow-node-heading"><span class="flow-node-kind"><span aria-hidden="true">▪</span>{{ kindLabel(node.kind) }}</span><span class="flow-node-id">#{{ displayText(node.id) }}</span></span>
                  <span class="flow-node-label">{{ displayText(node.label) }}</span>
                  <span class="flow-node-footer"><span :class="{ 'has-status': node.status }">{{ statusLabel(node.status) || '查看详情 ↗' }}</span><span v-if="node.priority" class="flow-node-priority">{{ displayText(/^\d+$/.test(node.priority) ? `P${node.priority}` : node.priority) }}</span></span>
                </button>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    <template v-if="graph.nodes.length">
      <figcaption class="flow-caption">
        <span class="flow-legend"><span v-for="entry in kinds" :key="entry.kind" :style="{ '--flow-kind': entry.color }">{{ entry.label }}</span></span>
        <span :id="`${id}-help`" class="flow-help"><template v-if="desktopInput"><span>悬停高亮关联 · 单击节点锁定详情 · 单击空白取消</span><span>按住空白拖动平移 · {{ wheelActive ? '滚轮缩放 · Shift / 横向滚动平移' : '停留 1.3 秒启用滚轮 · 移出后恢复页面滚动' }}</span></template><template v-else><span>轻点节点查看详情 · 轻点空白取消</span><span>滑动滚动文章 · 使用按钮缩放</span></template></span>
      </figcaption>
      <span class="flow-announcement" aria-live="polite">{{ selectedNode ? `已选中 ${displayText(selectedNode.id)}，详情显示于图下方。` : '' }}</span>

      <aside v-if="selectedNode" :id="`${id}-details`" class="flow-inspector" :style="{ '--flow-kind': kindColor(selectedNode.kind) }" aria-label="节点详情" data-toc-exclude :data-lenis-prevent="wheelActive || !desktopInput ? '' : undefined">
        <header class="flow-inspector-heading"><span><span aria-hidden="true">&gt;</span> {{ kindLabel(selectedNode.kind) }} / #{{ displayText(selectedNode.id) }} <span v-if="selectedNode.status">· {{ statusLabel(selectedNode.status) }}</span></span><button type="button" aria-label="关闭节点详情" @click="closeDetails">关闭 ×</button></header>
        <p class="flow-detail-title">{{ displayText(selectedNode.label) }}</p>
        <dl v-if="selectedNode.details.length" class="flow-detail-fields"><template v-for="(detail, index) in selectedNode.details" :key="index"><dt>{{ displayText(detail.label) }}</dt><dd>{{ displayText(detail.text) }}</dd></template></dl>
        <div v-if="incidentEdges.length" class="flow-neighbors"><span class="flow-neighbors-label">关联节点</span><button v-for="edge in incidentEdges" :key="edge.id" type="button" @click="selectNode(edge.source === selectedId ? edge.target : edge.source, true)">{{ edge.source === selectedId ? '→' : '←' }} {{ displayText(edge.label || '关联') }} / #{{ displayText(edge.source === selectedId ? edge.target : edge.source) }}</button></div>
      </aside>

      <details class="flow-outline" :data-lenis-prevent="wheelActive || !desktopInput ? '' : undefined">
        <summary>文字列表 <span>{{ graph.nodes.length }} 节点</span></summary>
        <div class="flow-outline-list" role="list"><div v-for="node in graph.nodes" :key="node.id" role="listitem"><button type="button" @click="selectNode(node.id, true)"><span>#{{ displayText(node.id) }} · {{ kindLabel(node.kind) }}</span>{{ displayText(node.label) }}</button></div></div>
      </details>
    </template>
    <p v-else class="flow-empty" role="status">暂无节点。传入 text 文字或 file 文件即可生成流程图。</p>
    <p v-if="fullscreenError" class="flow-empty" role="status">{{ fullscreenError }}</p>
  </figure>
</template>

<style scoped>
.content-flow { min-width: 0; margin: 0; border: 1px solid var(--flow-border); background: var(--flow-bg); color: var(--flow-text); overflow: hidden; }
.flow-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1rem; padding: 0.875rem 1rem; border-bottom: 1px solid var(--flow-border); }
.flow-heading { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem; min-width: 0; color: var(--flow-strong); font-size: 0.8125rem; overflow-wrap: anywhere; }
.flow-heading > :first-child { color: var(--flow-accent); }
.flow-count { color: var(--flow-muted); font-size: 0.6875rem; font-variant-numeric: tabular-nums; }
.flow-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem; }
.flow-tools button, .flow-inspector-heading button { display: inline-flex; align-items: center; justify-content: center; min-width: 1.875rem; min-height: 1.875rem; box-sizing: border-box; padding: 0.25rem 0.5rem; border: 1px solid var(--flow-border); background: var(--flow-bg); color: var(--flow-text); font: inherit; font-size: 0.6875rem; line-height: 1.4; cursor: pointer; }
.flow-tools button { flex: none; width: 2rem; height: 2rem; padding: 0; }
.flow-tools svg { display: block; width: 1rem; height: 1rem; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
.flow-viewport { position: relative; height: var(--flow-height, 520px); min-width: 0; background-color: var(--flow-bg); background-image: radial-gradient(var(--flow-soft) 0.75px, transparent 0.75px); background-size: 18px 18px; overflow: hidden; }
.flow-viewport.is-empty { height: 0; }
.flow-viewport.is-empty .flow-svg { display: none; }
.flow-svg { display: block; width: 100%; height: 100%; touch-action: auto; }
.flow-svg:focus-visible { outline: 1px solid var(--flow-accent); outline-offset: -3px; }
.flow-edge { fill: none; stroke: var(--flow-border); stroke-width: 1.25; vector-effect: non-scaling-stroke; pointer-events: none; }
.flow-edge.is-summary { stroke-dasharray: 4 4; }
.flow-edge.is-active { stroke: var(--flow-accent); stroke-width: 2.25; }
.flow-edge.is-muted { opacity: 0.15; }
.flow-arrow { fill: var(--flow-border); }
.flow-arrow.is-active { fill: var(--flow-accent); }
.flow-edge-label { pointer-events: none; }
.flow-edge-label.is-muted { opacity: 0.2; }
.flow-edge-label rect { fill: var(--flow-bg); }
.flow-edge-label text { fill: var(--flow-text); font: 11px var(--article-font, ui-monospace, monospace); text-anchor: middle; dominant-baseline: central; }
.flow-edge-label.is-active text { fill: var(--flow-accent); font-weight: 600; }
.flow-node { overflow: visible; }
.flow-node.is-muted { opacity: 0.25; }
.flow-node-shell { width: 100%; height: 100%; padding: 2px; box-sizing: border-box; }
.flow-node-card { display: flex; flex-direction: column; justify-content: space-between; gap: 0.375rem; width: 100%; height: 100%; box-sizing: border-box; padding: 0.75rem; border: 1px solid var(--flow-border); border-radius: 0; background: var(--flow-bg); color: var(--flow-text); font: 12px/1.55 var(--article-font, ui-monospace, monospace); text-align: left; cursor: pointer; overflow: hidden; }
.is-related .flow-node-card, .is-selected .flow-node-card { border-color: var(--flow-kind, var(--flow-accent)); }
.is-highlighted .flow-node-card { border-color: var(--flow-accent); box-shadow: inset 0 0 0 1px var(--flow-accent); }
.is-selected .flow-node-card { box-shadow: inset 2px 0 0 var(--flow-kind, var(--flow-accent)); }
.flow-node-heading, .flow-node-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%; font-size: 10px; line-height: 1.4; }
.flow-node-kind { display: inline-flex; align-items: center; gap: 0.375rem; color: var(--flow-kind, var(--flow-strong)); }
.flow-node-kind > span { color: var(--flow-kind, var(--flow-accent)); }
.flow-node-id { max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--flow-muted); }
.flow-node-label { display: -webkit-box; flex: 1; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.flow-node-footer { color: var(--flow-muted); }
.flow-node-footer .has-status { color: var(--flow-accent); }
.flow-node-priority { font-variant-numeric: tabular-nums; }
.flow-caption { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.5rem 1rem; padding: 0.625rem 1rem; border-top: 1px solid var(--flow-soft); color: var(--flow-muted); font-size: 0.625rem; line-height: 1.8; }
.flow-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.flow-help { display: flex; flex-wrap: wrap; gap: 0 1rem; }
.flow-legend > span::before { content: "▪"; margin-right: 0.3rem; color: var(--flow-kind, var(--flow-accent)); }
.flow-inspector { max-height: 22rem; padding: 1rem; border-top: 1px solid var(--flow-border); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: var(--flow-border) var(--flow-bg); }
.flow-inspector-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; color: var(--flow-muted); font-size: 0.6875rem; }
.flow-inspector-heading > span > span:first-child { color: var(--flow-kind, var(--flow-accent)); }
.flow-detail-title { margin: 0.75rem 0 0 !important; color: var(--flow-strong); font-size: 0.8125rem; line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere; }
.flow-detail-fields { margin: 1rem 0 0; font-size: 0.75rem; }
.flow-detail-fields dt { margin: 1rem 0 0.375rem; color: var(--flow-muted); font-size: 0.6875rem; }
.flow-detail-fields dd { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.flow-neighbors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--flow-soft); }
.flow-neighbors-label { width: 100%; color: var(--flow-muted); font-size: 0.6875rem; }
.flow-neighbors button { padding: 0.25rem 0.5rem; border: 1px solid var(--flow-border); background: transparent; color: var(--flow-text); font: inherit; font-size: 0.6875rem; cursor: pointer; }
.flow-outline { border-top: 1px solid var(--flow-border); font-size: 0.75rem; }
.flow-outline summary { padding: 0.625rem 1rem; color: var(--flow-muted); cursor: pointer; }
.flow-outline summary > span { margin-left: 0.5rem; font-size: 0.625rem; }
.flow-outline-list { max-height: 18rem; padding: 0 1rem 0.5rem; overflow-y: auto; overscroll-behavior: contain; }
/* While waiting, nested panels also let wheel scrolling reach the article. */
.is-wheel-pending .flow-inspector, .is-wheel-pending .flow-outline-list { overflow-y: hidden; overscroll-behavior: auto; }
.flow-outline-list button { display: flex; flex-direction: column; gap: 0.25rem; width: 100%; padding: 0.75rem 0; border: 0; border-top: 1px solid var(--flow-soft); background: transparent; color: var(--flow-text); font: inherit; text-align: left; cursor: pointer; white-space: pre-wrap; overflow-wrap: anywhere; }
.flow-outline-list button > span { color: var(--flow-muted); font-size: 0.6875rem; }
.content-flow button:focus-visible, .flow-outline summary:focus-visible { outline: 1px solid var(--flow-accent); outline-offset: -3px; }
.flow-empty { margin: 0 !important; padding: 1rem; color: var(--flow-muted); font-size: 0.75rem; }
.flow-announcement { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.content-flow:fullscreen { display: flex; flex-direction: column; width: 100%; height: 100dvh; border: 0; }
.content-flow:fullscreen .flow-viewport { flex: 1; height: auto; min-height: 200px; }
.content-flow:fullscreen .flow-inspector { max-height: 28dvh; }
@media (hover: hover) and (pointer: fine) {
  .flow-svg { cursor: grab; }
  .flow-svg:active, .is-dragging .flow-svg { cursor: grabbing; }
  .flow-node-card:hover { border-color: var(--flow-kind, var(--flow-accent)); }
  .flow-tools button:hover, .flow-inspector-heading button:hover { border-color: var(--flow-accent); color: var(--flow-accent); }
}
@media (max-width: 640px) {
  .flow-toolbar { padding: 0.75rem; }
  .flow-tools button { width: 2.25rem; height: 2.25rem; }
  .flow-viewport { max-height: 65svh; }
  .flow-caption { padding: 0.625rem 0.75rem; }
  .flow-inspector { padding: 0.75rem; }
  .content-flow:fullscreen .flow-viewport { max-height: none; }
}
</style>
