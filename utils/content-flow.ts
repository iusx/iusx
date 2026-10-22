import { readTimelineFile } from "./content-timeline";

export interface FlowNode {
  id: string;
  label: string;
  kind: string;
  status: string;
  priority: string;
  details: { label: string; text: string }[];
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  kind: string;
}

export interface FlowGraph { nodes: FlowNode[]; edges: FlowEdge[] }
export interface PositionedFlowNode extends FlowNode { x: number; y: number }
export interface PositionedFlowEdge extends FlowEdge { path: string; labelX: number; labelY: number; labelWidth: number; labelHeight: number }
export interface FlowLayout {
  nodes: PositionedFlowNode[];
  edges: PositionedFlowEdge[];
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
}

type DataRecord = Record<string, unknown>;
const MAX_NODES = 500;
const MAX_EDGES = 2000;
const MAX_TEXT_LENGTH = 100_000;
const MAX_DATA_LENGTH = 5_000_000;
const NODE_WIDTH = 240;
const NODE_HEIGHT = 128;
const COLUMN_GAP = 144;
const ROW_GAP = 64;
const PADDING_X = 112;
const PADDING_Y = 64;
const TRACK_SPACING = 28;
const SHAFT_SPACING = 14;
const LABEL_HEIGHT = 20;
const kinds = new Set(["fact", "intent", "goal", "finding", "digest", "origin", "note"]);
const relationLabels = new Map([
  ["derived_from", "意图链"], ["spawns", "派生"], ["yields", "产出"], ["proves", "证明"], ["covers", "汇总"],
]);

function object(value: unknown, description: string): DataRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${description}应为对象`);
  }
  return value as DataRecord;
}

function scalar(value: unknown, description: string): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  throw new Error(`${description}应为文字或数字`);
}

function nodeKind(value: unknown): string {
  const kind = scalar(value, "节点 kind").toLowerCase();
  return kind === "stateorigin" ? "origin" : kinds.has(kind) ? kind : "note";
}

// Bound both parsed JSON and callers supplying an object, before expanding payloads.
function inspectData(input: unknown): void {
  let length = 0;
  let values = 0;
  const ancestors = new Set<object>();
  function visit(value: unknown, depth: number): void {
    if (++values > 100_000 || depth > 64) throw new Error("JSON 数据结构过大或嵌套过深");
    if (typeof value === "string") length += value.length;
    if (length > MAX_DATA_LENGTH) throw new Error("JSON 文字总长度不能超过 5,000,000 个字符");
    if (value === null || typeof value !== "object") return;
    if (ancestors.has(value)) throw new Error("JSON 数据不能包含循环对象引用");
    ancestors.add(value);
    for (const entry of Object.values(value)) visit(entry, depth + 1);
    ancestors.delete(value);
  }
  visit(input, 0);
}

function checkCounts(nodes: number, edges: number): void {
  if (nodes > MAX_NODES) throw new Error(`流程图最多支持 ${MAX_NODES} 个节点，当前有 ${nodes} 个`);
  if (edges > MAX_EDGES) throw new Error(`流程图最多支持 ${MAX_EDGES} 条边，当前有 ${edges} 条`);
}

function checkReferences(nodes: FlowNode[], edges: FlowEdge[]): void {
  const ids = new Set<string>();
  for (const node of nodes) {
    if (!node.id) throw new Error("节点 id 不能为空");
    if (ids.has(node.id)) throw new Error(`节点 id「${node.id}」重复，请为每个节点使用唯一 id`);
    ids.add(node.id);
  }
  for (const edge of edges) {
    if (!ids.has(edge.source)) throw new Error(`边「${edge.id}」引用了不存在的起点「${edge.source}」`);
    if (!ids.has(edge.target)) throw new Error(`边「${edge.id}」引用了不存在的终点「${edge.target}」`);
  }
}

/** A deliberately small DSL: id[label] -->|edge label| id[label], including chains. */
export function parseFlowText(text: string): FlowGraph {
  if (text.length > MAX_TEXT_LENGTH) throw new Error("流程图文字不能超过 100,000 个字符");
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const byId = new Map<string, FlowNode>();
  const declarations = new Map<string, number>();

  text.split(/\r\n?|\n/).forEach((rawLine, lineIndex) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;
    const lineNumber = lineIndex + 1;
    let cursor = 0;
    const fail = (message: string): never => { throw new Error(`第 ${lineNumber} 行：${message}`); };
    const whitespace = () => { while (/\s/.test(line[cursor] ?? "") && cursor < line.length) cursor++; };
    const bracketed = (end: string, description: string): string => {
      let value = "";
      cursor++;
      while (cursor < line.length) {
        const character = line[cursor++];
        if (character === end) return value.trim();
        if (character === "\\" && cursor < line.length && [end, "\\"].includes(line[cursor])) {
          value += line[cursor++];
        } else value += character;
      }
      return fail(`${description}缺少结束符 ${end}`);
    };
    const readNode = (): string => {
      whitespace();
      const start = cursor;
      while (cursor < line.length && !line.startsWith("-->", cursor) && /[\p{L}\p{N}_.:\-]/u.test(line[cursor])) cursor++;
      const id = line.slice(start, cursor);
      if (!/^[\p{L}\p{N}_][\p{L}\p{N}_.:\-]*$/u.test(id)) {
        return fail("请使用节点 id 或 id[节点文字]；id 可含中文、字母、数字、下划线、点、冒号和短横线");
      }
      whitespace();
      let label: string | undefined;
      if (line[cursor] === "[") {
        label = bracketed("]", "节点文字");
        if (!label) fail(`节点「${id}」的文字不能为空`);
        if (declarations.has(id)) fail(`节点 id「${id}」重复声明（首次在第 ${declarations.get(id)} 行）；引用已有节点时只写 id`);
        declarations.set(id, lineNumber);
      }
      const existing = byId.get(id);
      if (existing) {
        if (label !== undefined) existing.label = label;
      } else {
        const node: FlowNode = { id, label: label ?? id, kind: "note", status: "", priority: "", details: [] };
        byId.set(id, node);
        nodes.push(node);
        checkCounts(nodes.length, edges.length);
      }
      whitespace();
      return id;
    };

    let source = readNode();
    while (cursor < line.length) {
      if (!line.startsWith("-->", cursor)) fail("节点之间请使用 -->，例如 a[开始] -->|完成| b[发布]");
      cursor += 3;
      whitespace();
      let label = "";
      if (line[cursor] === "|") label = bracketed("|", "连线文字");
      const target = readNode();
      edges.push({ id: `edge-${edges.length + 1}`, source, target, label, kind: "" });
      checkCounts(nodes.length, edges.length);
      source = target;
    }
  });
  return { nodes, edges };
}

/** Read standard nodes/edges, Artex broadcast items, or Artex exploration nodes. */
export function readFlowFile(input: unknown): FlowGraph {
  if (typeof input === "string") {
    if (input.length > MAX_DATA_LENGTH) throw new Error("JSON 文件不能超过 5,000,000 个字符");
    try { input = JSON.parse(input); } catch { throw new Error("流程图文件不是有效的 JSON，请检查引号、逗号和括号"); }
  }
  const document = object(input, "流程图 JSON ");
  const exploration = document.format === "artex.exploration-graph.v1";
  const artex = exploration || !Array.isArray(document.nodes) && Array.isArray(document.items);
  const items = exploration ? document.nodes : artex ? document.items : document.nodes;
  if (!Array.isArray(items)) throw new Error("JSON 应包含 nodes 数组，或 Artex 导出的 items 数组");
  const edgeItems = document.edges ?? [];
  if (!Array.isArray(edgeItems)) throw new Error("JSON 的 edges 应为数组");
  checkCounts(items.length, edgeItems.length);
  inspectData(document);

  const timeline = artex ? readTimelineFile({ ...document, items }) : [];
  const nodes: FlowNode[] = items.map((value, index) => {
    const item = object(value, `第 ${index + 1} 个节点`);
    const id = scalar(item.id, `第 ${index + 1} 个节点的 id`);
    if (!id) throw new Error(`第 ${index + 1} 个节点缺少 id`);
    if (artex) {
      const entry = timeline[index];
      const details = entry.details.map(detail => ({ ...detail }));
      if (entry.title && entry.text && entry.title !== entry.text) details.unshift({ label: "摘要", text: entry.text });
      return {
        id, label: entry.title || entry.text || id, kind: entry.status === "origin" ? "origin" : nodeKind(entry.kind),
        status: entry.status, priority: String(entry.priority), details,
      };
    }
    if (item.details != null && !Array.isArray(item.details)) throw new Error(`节点「${id}」的 details 应为数组`);
    const details = (item.details as unknown[] | undefined ?? []).map((value, detailIndex) => {
      const detail = object(value, `节点「${id}」的第 ${detailIndex + 1} 条详情`);
      return { label: scalar(detail.label, "详情 label") || "详情", text: scalar(detail.text, "详情 text") };
    });
    return {
      id, label: scalar(item.label, `节点「${id}」的 label`) || id,
      kind: nodeKind(item.kind), status: scalar(item.status, "节点 status"),
      priority: scalar(item.priority, "节点 priority"), details,
    };
  });

  // Reserve explicit ids first, so generated ids never collide with user ids.
  const edgeRecords = edgeItems.map((value, index) => object(value, `第 ${index + 1} 条边`));
  const reserved = new Set<string>();
  const explicitIds = edgeRecords.map((item, index) => {
    const id = scalar(item.id, `第 ${index + 1} 条边的 id`);
    if (id && reserved.has(id)) throw new Error(`边 id「${id}」重复，请为每条边使用唯一 id`);
    if (id) reserved.add(id);
    return id;
  });
  let nextId = 1;
  const edges: FlowEdge[] = edgeRecords.map((item, index) => {
    let id = explicitIds[index];
    if (!id) {
      while (reserved.has(`edge-${nextId}`)) nextId++;
      id = `edge-${nextId++}`;
      reserved.add(id);
    }
    const source = scalar(artex ? item.src : item.source, `边「${id}」的起点`);
    const target = scalar(artex ? item.dst : item.target, `边「${id}」的终点`);
    if (!source || !target) throw new Error(`边「${id}」缺少${!source ? "起点" : "终点"} ${artex ? "src/dst" : "source/target"}`);
    const kind = scalar(artex ? item.rel : item.kind, `边「${id}」的 kind`);
    return { id, source, target, kind, label: scalar(item.label, `边「${id}」的 label`) || (artex ? relationLabels.get(kind) ?? kind : "") };
  });
  checkReferences(nodes, edges);
  return { nodes, edges };
}

type Point = { x: number; y: number };
const number = (value: number): string => String(Math.round(value * 100) / 100);
const point = (value: Point): string => `${number(value.x)} ${number(value.y)}`;

// All segments are cubic Béziers; straight runs join rounded bends in the free gaps.
function roundedPath(points: Point[]): string {
  const unique = points.filter((value, index) => !index || value.x !== points[index - 1].x || value.y !== points[index - 1].y);
  let path = `M ${point(unique[0])}`;
  let current = unique[0];
  for (let index = 1; index < unique.length - 1; index++) {
    const before = unique[index - 1];
    const corner = unique[index];
    const after = unique[index + 1];
    const incoming = Math.hypot(corner.x - before.x, corner.y - before.y);
    const outgoing = Math.hypot(after.x - corner.x, after.y - corner.y);
    const radius = Math.min(12, incoming / 2, outgoing / 2);
    const entry = { x: corner.x - (corner.x - before.x) / incoming * radius, y: corner.y - (corner.y - before.y) / incoming * radius };
    const exit = { x: corner.x + (after.x - corner.x) / outgoing * radius, y: corner.y + (after.y - corner.y) / outgoing * radius };
    path += ` C ${point(current)} ${point(entry)} ${point(entry)} C ${point(corner)} ${point(corner)} ${point(exit)}`;
    current = exit;
  }
  const end = unique[unique.length - 1];
  return `${path} C ${point(current)} ${point(end)} ${point(end)}`;
}

// Use the rendered cubics for line avoidance, including the rounded corners.
function pathSamples(path: string): Point[] {
  const values = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let first = { x: values[0], y: values[1] };
  const samples = [first];
  for (let index = 2; index < values.length; index += 6) {
    const [x1, y1, x2, y2, x3, y3] = values.slice(index, index + 6);
    const straight = Math.abs((x1 - first.x) * (y3 - first.y) - (y1 - first.y) * (x3 - first.x)) < 0.01 &&
      Math.abs((x2 - first.x) * (y3 - first.y) - (y2 - first.y) * (x3 - first.x)) < 0.01;
    const steps = straight ? 1 : 32;
    for (let sample = 1; sample <= steps; sample++) {
      const t = sample / steps;
      samples.push({
        x: (1 - t) ** 3 * first.x + 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
        y: (1 - t) ** 3 * first.y + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3,
      });
    }
    first = { x: x3, y: y3 };
  }
  return samples;
}

type Rectangle = { left: number; top: number; right: number; bottom: number };
const labelRectangle = (center: Point, width: number, height: number): Rectangle => ({
  left: center.x - width / 2, top: center.y - height / 2, right: center.x + width / 2, bottom: center.y + height / 2,
});
const intersects = (a: Rectangle, b: Rectangle): boolean => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// A small uniform grid keeps label placement local even at the input limits.
function rectangleIndex<T extends Rectangle>() {
  const cells = new Map<string, T[]>();
  const keys = (box: Rectangle): string[] => {
    const result: string[] = [];
    for (let x = Math.floor(box.left / 192); x <= Math.floor(box.right / 192); x++) {
      for (let y = Math.floor(box.top / 192); y <= Math.floor(box.bottom / 192); y++) result.push(`${x}:${y}`);
    }
    return result;
  };
  return {
    add(box: T): void { for (const key of keys(box)) { const entries = cells.get(key) ?? []; entries.push(box); cells.set(key, entries); } },
    find(box: Rectangle): T[] {
      const found = new Set<T>();
      for (const key of keys(box)) for (const candidate of cells.get(key) ?? []) if (intersects(box, candidate)) found.add(candidate);
      return [...found];
    },
  };
}

function segmentHitsRectangle(first: Point, last: Point, box: Rectangle): boolean {
  let from = 0;
  let to = 1;
  for (const [start, delta, minimum, maximum] of [[first.x, last.x - first.x, box.left - 2, box.right + 2], [first.y, last.y - first.y, box.top - 2, box.bottom + 2]]) {
    if (!delta) { if (start < minimum || start > maximum) return false; }
    else {
      const a = (minimum - start) / delta;
      const b = (maximum - start) / delta;
      from = Math.max(from, Math.min(a, b));
      to = Math.min(to, Math.max(a, b));
      if (from > to) return false;
    }
  }
  return true;
}

/** Deterministic SCC ordering, longest-path ranks and barycentric ordering; no simulation. */
export function layoutFlow(graph: FlowGraph): FlowLayout {
  // Also validate callers that construct FlowGraph themselves, without mutating their data.
  const clean = readFlowFile(graph);
  const count = clean.nodes.length;
  if (!count) return { nodes: [], edges: [], width: 0, height: 0, nodeWidth: NODE_WIDTH, nodeHeight: NODE_HEIGHT };
  const indexById = new Map(clean.nodes.map((node, index) => [node.id, index]));
  const endpoints = clean.edges.map(edge => ({ source: indexById.get(edge.source)!, target: indexById.get(edge.target)! }));
  const outgoing = Array.from({ length: count }, () => [] as number[]);
  const incoming = Array.from({ length: count }, () => [] as number[]);
  endpoints.forEach((edge, index) => { outgoing[edge.source].push(index); incoming[edge.target].push(index); });

  // Tarjan's components keep cyclic input intact. Only ranking ignores feedback edges.
  const discovery = Array(count).fill(-1) as number[];
  const low = Array(count).fill(0) as number[];
  const onStack = Array(count).fill(false) as boolean[];
  const stack: number[] = [];
  const components: number[][] = [];
  const componentOf = Array(count).fill(-1) as number[];
  let clock = 0;
  const visit = (node: number): void => {
    discovery[node] = low[node] = clock++;
    stack.push(node);
    onStack[node] = true;
    for (const edgeIndex of outgoing[node]) {
      const next = endpoints[edgeIndex].target;
      if (discovery[next] < 0) { visit(next); low[node] = Math.min(low[node], low[next]); }
      else if (onStack[next]) low[node] = Math.min(low[node], discovery[next]);
    }
    if (low[node] !== discovery[node]) return;
    const component: number[] = [];
    let member: number;
    do {
      member = stack.pop()!;
      onStack[member] = false;
      componentOf[member] = components.length;
      component.push(member);
    } while (member !== node);
    components.push(component.sort((a, b) => a - b));
  };
  for (let node = 0; node < count; node++) if (discovery[node] < 0) visit(node);

  const activeIncoming = Array(count).fill(0) as number[];
  const activeOutgoing = Array(count).fill(0) as number[];
  for (const { source, target } of endpoints) {
    if (source !== target && componentOf[source] === componentOf[target]) {
      activeIncoming[target]++;
      activeOutgoing[source]++;
    }
  }
  const localOrder = Array(count).fill(0) as number[];
  for (const component of components) {
    const active = new Set(component);
    const left: number[] = [];
    const right: number[] = [];
    while (active.size) {
      let source = -1;
      let sink = -1;
      let best = -1;
      let bestScore = -Infinity;
      for (const node of component) {
        if (!active.has(node)) continue;
        const inCount = activeIncoming[node];
        const outCount = activeOutgoing[node];
        if (!inCount && source < 0) source = node;
        if (!outCount && sink < 0) sink = node;
        if (outCount - inCount > bestScore) { best = node; bestScore = outCount - inCount; }
      }
      const chosen = source >= 0 ? source : sink >= 0 ? sink : best;
      active.delete(chosen);
      for (const edge of outgoing[chosen]) {
        const target = endpoints[edge].target;
        if (active.has(target)) activeIncoming[target]--;
      }
      for (const edge of incoming[chosen]) {
        const source = endpoints[edge].source;
        if (active.has(source)) activeOutgoing[source]--;
      }
      if (source < 0 && sink >= 0) right.push(chosen);
      else left.push(chosen);
    }
    [...left, ...right.reverse()].forEach((node, order) => { localOrder[node] = order; });
  }
  const forward = endpoints.map(edge => componentOf[edge.source] !== componentOf[edge.target] || localOrder[edge.source] < localOrder[edge.target]);
  const indegree = Array(count).fill(0) as number[];
  endpoints.forEach((edge, index) => { if (forward[index]) indegree[edge.target]++; });
  const ready = clean.nodes.map((_, index) => index).filter(index => !indegree[index]);
  const rank = Array(count).fill(0) as number[];
  while (ready.length) {
    const node = ready.shift()!;
    for (const edgeIndex of outgoing[node]) {
      if (!forward[edgeIndex]) continue;
      const target = endpoints[edgeIndex].target;
      rank[target] = Math.max(rank[target], rank[node] + 1);
      if (--indegree[target] === 0) { ready.push(target); ready.sort((a, b) => a - b); }
    }
  }
  const layers = Array.from({ length: Math.max(...rank) + 1 }, () => [] as number[]);
  rank.forEach((layer, node) => layers[layer].push(node));
  const rows = Array(count).fill(0) as number[];
  const maxRows = Math.max(...layers.map(layer => layer.length));
  const updateRows = () => layers.forEach(layer => {
    const offset = Math.floor((maxRows - layer.length) / 2);
    layer.forEach((node, row) => { rows[node] = row + offset; });
  });
  updateRows();
  // Stable ties preserve authored order and avoid oscillation in symmetric branches.
  for (let sweep = 0; sweep < 8; sweep++) {
    const direction = sweep % 2 === 0 ? 1 : -1;
    for (let layerIndex = direction > 0 ? 1 : layers.length - 2; layerIndex >= 0 && layerIndex < layers.length; layerIndex += direction) {
      const layer = layers[layerIndex];
      const previous = new Map(layer.map((node, index) => [node, index]));
      const barycenter = (node: number): number => {
        const edges = direction > 0 ? incoming[node] : outgoing[node];
        let total = 0;
        let neighbors = 0;
        for (const index of edges) {
          if (!forward[index]) continue;
          total += rows[direction > 0 ? endpoints[index].source : endpoints[index].target];
          neighbors++;
        }
        return neighbors ? total / neighbors : rows[node];
      };
      const centers = new Map(layer.map(node => [node, barycenter(node)]));
      layer.sort((a, b) => centers.get(a)! - centers.get(b)! || previous.get(a)! - previous.get(b)!);
      const offset = Math.floor((maxRows - layer.length) / 2);
      layer.forEach((node, row) => { rows[node] = row + offset; });
    }
  }
  const labelWidths = clean.edges.map(edge => edge.label ? Math.min(edge.label.length, 18) * 11 + 14 : 0);
  const pairCounts = new Map<string, number>();
  endpoints.forEach(({ source, target }) => {
    const key = `${source}:${target}`;
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
  });
  const useTrack = endpoints.map(({ source, target }) => source !== target &&
    (rank[target] !== rank[source] + 1 || pairCounts.get(`${source}:${target}`)! > 1));

  // Color overlapping horizontal intervals before sizing the row gaps. Each lane
  // has room for a 20px label and 8px of clear space, with no fixed lane limit.
  const tracks = Array.from({ length: maxRows + 1 }, () => [] as { intervals: [number, number][]; y: number }[]);
  const edgeTrack = new Map<number, { intervals: [number, number][]; y: number }>();
  const tracked = endpoints.map((_, index) => index).filter(index => useTrack[index]);
  tracked.sort((a, b) => Math.abs(rank[endpoints[b].target] - rank[endpoints[b].source]) -
    Math.abs(rank[endpoints[a].target] - rank[endpoints[a].source]) || a - b);
  for (const edgeIndex of tracked) {
    const { source, target } = endpoints[edgeIndex];
    const left = Math.min(rank[source] + 1, rank[target]);
    const right = Math.max(rank[source] + 1, rank[target]);
    const middle = (rows[source] + rows[target] + 1) / 2;
    let chosenGap = 0;
    let chosenLane = 0;
    let bestCost = Infinity;
    tracks.forEach((lanes, gap) => {
      let lane = lanes.findIndex(track => track.intervals.every(([start, end]) => right + 0.1 < start || left > end + 0.1));
      if (lane < 0) lane = lanes.length;
      const cost = Math.abs(gap - middle) * (NODE_HEIGHT + ROW_GAP) + lane * TRACK_SPACING;
      if (cost < bestCost) { bestCost = cost; chosenGap = gap; chosenLane = lane; }
    });
    const lanes = tracks[chosenGap];
    if (!lanes[chosenLane]) lanes.push({ intervals: [], y: 0 });
    lanes[chosenLane].intervals.push([left, right]);
    edgeTrack.set(edgeIndex, lanes[chosenLane]);
  }
  const rowGaps = tracks.map(lanes => Math.max(ROW_GAP, lanes.length * TRACK_SPACING + 28));
  rowGaps[0] = Math.max(PADDING_Y, rowGaps[0]);
  rowGaps[maxRows] = Math.max(PADDING_Y, rowGaps[maxRows]);
  const rowY: number[] = [];
  let bottom = 0;
  tracks.forEach((lanes, gap) => {
    lanes.forEach((track, lane) => { track.y = bottom + (rowGaps[gap] - (lanes.length - 1) * TRACK_SPACING) / 2 + lane * TRACK_SPACING; });
    if (gap < maxRows) { rowY.push(bottom + rowGaps[gap]); bottom += rowGaps[gap] + NODE_HEIGHT; }
  });

  // Distinct vertical shafts prevent long edges from sharing the same trunk.
  // Only crowded gaps grow; ordinary adjacent links retain their direct curve.
  const shafts = Array.from({ length: layers.length + 1 }, () => [] as { edge: number; source: boolean }[]);
  const loopWidth = Array(layers.length + 1).fill(0) as number[];
  endpoints.forEach(({ source, target }, edge) => {
    if (useTrack[edge] || source === target) shafts[rank[source] + 1].push({ edge, source: true });
    if (useTrack[edge]) shafts[rank[target]].push({ edge, source: false });
    if (source === target) loopWidth[rank[source] + 1] = Math.max(loopWidth[rank[source] + 1], labelWidths[edge]);
  });
  const columnGaps = shafts.map((entries, gap) => Math.max(
    gap === 0 || gap === layers.length ? PADDING_X : COLUMN_GAP,
    Math.max(0, entries.length - 1) * SHAFT_SPACING + 48 + loopWidth[gap],
  ));
  endpoints.forEach(({ source, target }, edge) => {
    if (!useTrack[edge] && source !== target) columnGaps[rank[target]] = Math.max(columnGaps[rank[target]], labelWidths[edge] + 32);
  });
  const columnX: number[] = [];
  const sourceShaft = Array(clean.edges.length).fill(0) as number[];
  const targetShaft = Array(clean.edges.length).fill(0) as number[];
  let right = 0;
  shafts.forEach((entries, gap) => {
    entries.forEach((entry, index) => {
      (entry.source ? sourceShaft : targetShaft)[entry.edge] = right + (columnGaps[gap] - (entries.length - 1) * SHAFT_SPACING) / 2 + index * SHAFT_SPACING;
    });
    if (gap < layers.length) { columnX.push(right + columnGaps[gap]); right += columnGaps[gap] + NODE_WIDTH; }
  });
  const nodes: PositionedFlowNode[] = clean.nodes.map((node, index) => ({
    ...node, x: columnX[rank[index]], y: rowY[rows[index]],
  }));

  const sourcePort = Array(clean.edges.length).fill(0) as number[];
  const targetPort = Array(clean.edges.length).fill(0) as number[];
  // Allocate both sides of a column gap together. Independent per-node ports
  // can put an outgoing and incoming connector on the same horizontal run.
  // Loop entrances and exits also occupy separate ports on the right side.
  const portGroups = new Map<string, { edge: number; source: boolean; neighbor: number; order: number }[]>();
  endpoints.forEach(({ source, target }, edge) => {
    const loop = source === target;
    for (const entry of [
      { edge, source: true, node: source, gap: rank[source] + 1, neighbor: target, order: loop ? -1 : 0 },
      { edge, source: false, node: target, gap: loop ? rank[source] + 1 : rank[target], neighbor: source, order: loop ? 1 : 0 },
    ]) {
      const key = `${entry.gap}:${rows[entry.node]}`;
      const group = portGroups.get(key) ?? [];
      group.push(entry);
      portGroups.set(key, group);
    }
  });
  portGroups.forEach(group => {
    group.sort((a, b) => {
      return a.order - b.order || rows[a.neighbor] - rows[b.neighbor] || rank[a.neighbor] - rank[b.neighbor] || a.edge - b.edge || Number(a.source) - Number(b.source);
    });
    const spacing = Math.min(14, (NODE_HEIGHT - 36) / Math.max(1, group.length - 1));
    group.forEach((entry, index) => { (entry.source ? sourcePort : targetPort)[entry.edge] = (index - (group.length - 1) / 2) * spacing; });
  });

  const routes: { path: string; anchors: Point[] }[] = clean.edges.map((_, edgeIndex) => {
    const { source, target } = endpoints[edgeIndex];
    const first = nodes[source];
    const last = nodes[target];
    const start = { x: first.x + NODE_WIDTH, y: first.y + NODE_HEIGHT / 2 + sourcePort[edgeIndex] };
    const end = { x: last.x, y: last.y + NODE_HEIGHT / 2 + targetPort[edgeIndex] };
    if (source === target) {
      const y1 = start.y;
      const y2 = end.y;
      const x = sourceShaft[edgeIndex];
      const points = [{ x: start.x, y: y1 }, { x, y: y1 }, { x, y: y2 }, { x: start.x, y: y2 }];
      return { path: roundedPath(points), anchors: [0.5, 0.3, 0.7].map(t => ({ x, y: y1 + (y2 - y1) * t })) };
    }
    if (!useTrack[edgeIndex]) {
      const bend = (end.x - start.x) / 2;
      const at = (t: number): Point => ({
        x: (1 - t) ** 3 * start.x + 3 * (1 - t) ** 2 * t * (start.x + bend) + 3 * (1 - t) * t ** 2 * (end.x - bend) + t ** 3 * end.x,
        y: (1 - t) ** 3 * start.y + 3 * (1 - t) ** 2 * t * start.y + 3 * (1 - t) * t ** 2 * end.y + t ** 3 * end.y,
      });
      return {
        path: `M ${point(start)} C ${number(start.x + bend)} ${number(start.y)} ${number(end.x - bend)} ${number(end.y)} ${point(end)}`,
        anchors: [0.5, 0.35, 0.65, 0.2, 0.8].map(t => { const p = at(t); return { x: p.x, y: p.y - 8 }; }),
      };
    }
    const sourceX = sourceShaft[edgeIndex];
    const targetX = targetShaft[edgeIndex];
    const y = edgeTrack.get(edgeIndex)!.y;
    const points = [start, { x: sourceX, y: start.y }, { x: sourceX, y }, { x: targetX, y }, { x: targetX, y: end.y }, end];
    return {
      path: roundedPath(points),
      anchors: [0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9].map(t => ({ x: sourceX + (targetX - sourceX) * t, y: y - 14 })),
    };
  });

  const occupied = rectangleIndex<Rectangle>();
  nodes.forEach(node => occupied.add({ left: node.x - 8, top: node.y - 8, right: node.x + NODE_WIDTH + 8, bottom: node.y + NODE_HEIGHT + 8 }));
  const lines = rectangleIndex<Rectangle & { first: Point; last: Point; edge: number }>();
  if (labelWidths.some(Boolean)) routes.forEach((route, edge) => {
    const samples = pathSamples(route.path);
    samples.slice(1).forEach((last, index) => {
      const first = samples[index];
      lines.add({ left: Math.min(first.x, last.x) - 2, top: Math.min(first.y, last.y) - 2,
        right: Math.max(first.x, last.x) + 2, bottom: Math.max(first.y, last.y) + 2, first, last, edge });
    });
  });
  const edges: PositionedFlowEdge[] = clean.edges.map((edge, edgeIndex) => {
    const route = routes[edgeIndex];
    const labelWidth = labelWidths[edgeIndex];
    const preferred = route.anchors[0];
    let position = preferred;
    if (labelWidth) {
      let best: { point: Point; cost: number } | undefined;
      const consider = (candidate: Point): boolean => {
        const box = labelRectangle(candidate, labelWidth, LABEL_HEIGHT);
        if (box.left < 0 || box.top < 0 || occupied.find(box).length) return false;
        const hits = lines.find(box).filter(line => line.edge !== edgeIndex && segmentHitsRectangle(line.first, line.last, box)).length;
        const cost = hits * 100 + Math.hypot(candidate.x - preferred.x, candidate.y - preferred.y) * 0.05;
        if (!best || cost < best.cost) best = { point: candidate, cost };
        return hits === 0;
      };
      // Try points on this edge first, then nearby parallel offsets. Crossings
      // with other lines are a soft cost; node and label collisions are forbidden.
      let clear = false;
      for (const offset of [0, 28, -28, 56, -56, 84, -84, 112, -112]) {
        for (const anchor of route.anchors) {
          if (consider({ x: anchor.x, y: anchor.y + offset })) { clear = true; break; }
        }
        if (clear) break;
      }
      // A finite set of rectangles always leaves a free outer ring. This also
      // handles many parallel edges or self loops without dropping any labels.
      for (let ring = 1; !clear && (!best || ring <= 6); ring++) {
        for (let step = -ring; step <= ring; step++) {
          const offsets = [{ x: step * 24, y: -ring * 24 }, { x: step * 24, y: ring * 24 }];
          if (Math.abs(step) < ring) offsets.push({ x: -ring * 24, y: step * 24 }, { x: ring * 24, y: step * 24 });
          for (const offset of offsets) if (consider({ x: preferred.x + offset.x, y: preferred.y + offset.y })) { clear = true; break; }
          if (clear) break;
        }
      }
      position = best!.point;
      const box = labelRectangle(position, labelWidth, LABEL_HEIGHT);
      occupied.add({ left: box.left - 4, top: box.top - 4, right: box.right + 4, bottom: box.bottom + 4 });
    }
    return { ...edge, path: route.path, labelX: position.x, labelY: position.y, labelWidth, labelHeight: LABEL_HEIGHT };
  });
  return {
    nodes, edges,
    width: Math.max(right + columnGaps[layers.length], ...edges.filter(edge => edge.label).map(edge => edge.labelX + edge.labelWidth / 2 + 24)),
    height: Math.max(bottom + rowGaps[maxRows], ...edges.filter(edge => edge.label).map(edge => edge.labelY + edge.labelHeight / 2 + 24)),
    nodeWidth: NODE_WIDTH, nodeHeight: NODE_HEIGHT,
  };
}
