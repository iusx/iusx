// Run: node tools/check-content-interactions.cjs
// Evaluate actual source functions with controlled browser APIs and async work.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const nuxtRoot = path.dirname(require.resolve('nuxt/package.json'));
const { transformSync } = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const { computed, reactive, defineComponent, h } = require(require.resolve('vue', { paths: [nuxtRoot] }));
function source(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function section(text, start, end) {
  const from = text.indexOf(start);
  const to = text.indexOf(end, from);
  assert(from >= 0 && to > from, `Could not find ${start}`);
  return text.slice(from, to);
}
function evaluate(code, globals) {
  const context = vm.createContext(globals);
  vm.runInContext(transformSync(code, { loader: 'ts', target: 'es2022' }).code, context);
  return context;
}
const results = [];
function test(name, run) { run(); results.push(name); }

test('graph indexes preserve edge order, self loops, selection and reactive updates', () => {
  const text = source('components/ContentFlowCanvas.vue');
  const props = reactive({ graph: { edges: [
    { id: 'loop', source: 'a', target: 'a' }, { id: 'ab', source: 'a', target: 'b' },
    { id: 'ba', source: 'b', target: 'a' }, { id: 'bb', source: 'b', target: 'b' },
  ] } });
  const layout = computed(() => ({ nodes: [{ id: 'a' }, { id: 'b' }] }));
  const context = evaluate(section(text, 'const nodesById =', 'const startingNode =')
    + '\nglobalThis.indexes = { nodesById, edgesByNode };', { computed, props, layout });
  function compare() {
    for (const id of ['a', 'b', 'c', '']) {
      const indexed = context.indexes.edgesByNode.value.get(id) || [];
      const scanned = props.graph.edges.filter(edge => edge.source === id || edge.target === id);
      assert.equal(JSON.stringify(indexed), JSON.stringify(scanned));
      assert.equal(context.indexes.nodesById.value.get(id), layout.value.nodes.find(node => node.id === id));
    }
  }
  compare();
  props.graph.edges.push({ id: 'bc', source: 'b', target: 'c' });
  compare();
  props.graph.edges = [{ id: 'cc', source: 'c', target: 'c' }];
  compare();
});

test('TOC equivalence detects every rendered field, hierarchy and order', () => {
  const text = source('components/content/TableOfContents.vue');
  const context = evaluate(section(text, 'function sameHeadings(', 'function refreshHeadings(')
    + '\nglobalThis.same = sameHeadings;', {});
  const original = [{ id: 'one', text: '第一章', level: 1, count: null, children: [
    { id: 'two', text: '第二节', level: 3, count: 2, children: [] },
  ] }];
  const clone = () => JSON.parse(JSON.stringify(original));
  assert.equal(context.same(original, clone()), true);
  for (const [key, value] of [['id', 'changed'], ['text', '变化'], ['level', 4], ['count', 0]]) {
    const next = clone();
    next[0].children[0][key] = value;
    assert.equal(context.same(original, next), false, key);
  }
  assert.equal(context.same(original, []), false);
  const moved = clone();
  moved.push(moved[0].children.pop());
  assert.equal(context.same(original, moved), false);
});

function tocScrollHarness() {
  const text = source('components/content/TableOfContents.vue');
  const frames = new Map();
  const window = { scrollY: 0, innerHeight: 1000, location: { hash: '#typography' } };
  const activeId = { value: 'typography' };
  const reads = [];
  const box = (name, top, height = 40) => ({ getBoundingClientRect: () => {
    reads.push(name);
    return { top: top - window.scrollY, bottom: top + height - window.scrollY };
  } });
  const heading = (id, top) => ({ id, element: box(id, top) });
  const headingGroups = [
    { element: box('section-1', 0, 1500), headings: [heading('typography', 100), heading('excerpt', 900)] },
    { element: box('section-2', 1500, 2000), headings: [heading('gallery', 1600), heading('annotation', 1750)] },
    { element: box('section-3', 3500, 2000), headings: [heading('last', 3600)] },
  ];
  let frameId = 0;
  const context = evaluate('let activeFrame = null;\n'
    + section(text, 'function updateActiveHeading()', 'function affectsHeadings(')
    + '\nglobalThis.api = { updateActiveHeading, scheduleActiveHeading };', {
    headingGroups, activeId, window, mounted: true,
    document: { documentElement: { scrollHeight: 6000 } },
    requestAnimationFrame: callback => { const id = ++frameId; frames.set(id, callback); return id; },
  });
  return { ...context.api, window, activeId, frames, reads, headingGroups,
    frame() {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach(callback => callback());
    },
  };
}

test('TOC follows scrolling in both directions while the clicked URL hash stays unchanged', () => {
  const scroll = tocScrollHarness();
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, 'typography');
  scroll.window.scrollY = 1350;
  scroll.scheduleActiveHeading();
  scroll.scheduleActiveHeading();
  assert.equal(scroll.frames.size, 1, 'rapid scroll events must share one frame');
  scroll.frame();
  assert.equal(scroll.activeId.value, 'gallery');
  assert.equal(scroll.window.location.hash, '#typography');
  scroll.window.scrollY = 1500;
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, 'annotation');
  scroll.window.scrollY = 800;
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, 'excerpt');
  scroll.window.scrollY = 5000;
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, 'last');
});

test('TOC reads headings only in the current deferred section and handles layout changes', () => {
  const scroll = tocScrollHarness();
  scroll.window.scrollY = 1500;
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, 'annotation');
  assert(!scroll.reads.includes('typography') && !scroll.reads.includes('last'), 'distant headings must keep their deferred layout');
  // An image or an activated section can move titles without a window scroll.
  scroll.headingGroups[1].headings[1].element.getBoundingClientRect = () => ({ top: 600, bottom: 640 });
  scroll.scheduleActiveHeading();
  scroll.frame();
  assert.equal(scroll.activeId.value, 'gallery');
  scroll.headingGroups.length = 0;
  scroll.updateActiveHeading();
  assert.equal(scroll.activeId.value, '');
});

test('TOC renders the current subsection and highlights its parent chapter', () => {
  const text = source('components/content/TableOfContents.vue');
  const context = evaluate(section(text, 'const containsHeading =', 'const normalizeText =')
    + '\nglobalThis.list = TocList;', { defineComponent, h });
  const items = [
    { id: 'typography', text: '文字排版', count: null, children: [] },
    { id: 'gallery', text: '图片与画廊', count: null, children: [
      { id: 'annotation', text: '图文注释', count: null, children: [] },
    ] },
  ];
  const render = context.list.setup({ items, activeId: 'annotation' }, { emit() {} });
  const tree = render();
  const previous = tree.children[0].children[0].children[0];
  const chapter = tree.children[1].children[0].children[0];
  assert.equal(previous.props['data-active-ancestor'], undefined);
  assert.equal(chapter.props['data-active-ancestor'], '');
  assert.equal(chapter.props['aria-current'], undefined);
  const nested = tree.children[1].children[1];
  const childTree = nested.type.setup(nested.props, { emit() {} })();
  assert.equal(childTree.children[0].children[0].children[0].props['aria-current'], 'location');
});

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function copyHarness() {
  const requests = [], writes = [], timers = new Map();
  const copying = { value: false }, copyMessage = { value: '' };
  const text = source('components/ImagePreview.vue');
  const context = evaluate('let copyFeedbackTimer; let copyController; let copyTask = 0;\n'
    + section(text, 'async function pngBlob(', 'function close()')
    + '\nglobalThis.api = { copyImage, cancelCopy };', {
    props: { src: '/image.png' }, copying, copyMessage, AbortController, DOMException,
    ClipboardItem: class { constructor(data) { this.data = data; } },
    fetch: (src, { signal }) => {
      const request = { ...deferred(), src, signal };
      signal.addEventListener('abort', () => request.reject(new DOMException('Aborted', 'AbortError')), { once: true });
      requests.push(request);
      return request.promise;
    },
    navigator: { clipboard: { write: async items => {
      const gate = deferred();
      writes.push(gate);
      await items[0].data['image/png'];
      await gate.promise;
    } } },
    setTimeout: callback => { const id = Symbol(); timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
  });
  const respond = index => requests[index].resolve({ ok: true, blob: async () => ({ type: 'image/png' }) });
  return { ...context.api, requests, writes, timers, copying, copyMessage, respond };
}
async function asyncTest(name, run) { await run(); results.push(name); }
(async () => {
  await asyncTest('closing a pending copy aborts its request without feedback or a new timer', async () => {
    const h = copyHarness();
    const pending = h.copyImage();
    assert.equal(h.copying.value, true);
    h.cancelCopy();
    assert.equal(h.requests[0].signal.aborted, true);
    await pending;
    assert.equal(h.copying.value, false);
    assert.equal(h.copyMessage.value, '');
    assert.equal(h.timers.size, 0);
  });
  await asyncTest('a stale successful copy cannot override the next image copy state', async () => {
    const h = copyHarness();
    const old = h.copyImage();
    h.respond(0);
    await new Promise(resolve => setImmediate(resolve));
    h.cancelCopy();
    const next = h.copyImage();
    h.writes[0].resolve();
    await old;
    assert.equal(h.copying.value, true);
    assert.equal(h.copyMessage.value, '');
    assert.equal(h.timers.size, 0);
    h.respond(1);
    h.writes[1].resolve();
    await next;
    assert.equal(h.copying.value, false);
    assert.equal(h.copyMessage.value, '图片已复制');
    assert.equal(h.timers.size, 1);
    h.cancelCopy();
    assert.equal(h.timers.size, 0);
  });
  await asyncTest('a stale failed copy cannot display an error after cancellation', async () => {
    const h = copyHarness();
    const pending = h.copyImage();
    h.respond(0);
    await new Promise(resolve => setImmediate(resolve));
    h.cancelCopy();
    h.copyMessage.value = 'current image';
    h.writes[0].reject(new Error('Permission denied'));
    await pending;
    assert.equal(h.copyMessage.value, 'current image');
    assert.equal(h.timers.size, 0);
  });
  console.log(JSON.stringify({ testsPassed: results.length, cases: results }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
