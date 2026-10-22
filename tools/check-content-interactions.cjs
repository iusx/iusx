// Run: node tools/check-content-interactions.cjs
// Evaluate actual source functions with controlled browser APIs and async work.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const nuxtRoot = path.dirname(require.resolve('nuxt/package.json'));
const { transformSync } = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const { computed, reactive } = require(require.resolve('vue', { paths: [nuxtRoot] }));
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
