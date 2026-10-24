// Run: node tools/check-content-flow.cjs [path/to/previous-content-flow.ts]
// Uses the esbuild already installed with Nuxt; no test dependency is required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const nuxtRoot = path.dirname(require.resolve('nuxt/package.json'));
const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));

function load(file) {
  const result = esbuild.buildSync({
    stdin: { contents: fs.readFileSync(file, 'utf8'), loader: 'ts', resolveDir: path.join(root, 'utils') },
    bundle: true, write: false, platform: 'node', format: 'cjs', target: 'es2022',
  });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, require });
  return module.exports;
}

const current = load(path.join(root, 'utils/content-flow.ts'));
const baseline = process.argv[2] ? load(path.resolve(process.argv[2])) : null;
const node = id => ({ id, label: id, kind: 'note', status: '', priority: '', details: [] });
function graph(size, pairs, labels = false) {
  return {
    nodes: Array.from({ length: size }, (_, i) => node(`n${i}`)),
    edges: pairs.map(([source, target], i) => ({
      id: `e${i}`, source: `n${source}`, target: `n${target}`, label: labels ? `关系 ${i}` : '', kind: '',
    })),
  };
}
const denseCycle = graph(500, Array.from({ length: 500 }, (_, i) =>
  [1, 2, 5, 13].map(step => [i, (i + step) % 500])).flat());
const maxDag = graph(500, Array.from({ length: 500 }, (_, i) =>
  [1, 2, 5, 13].filter(step => i + step < 500).map(step => [i, i + step])).flat());
const fixtures = [
  ['empty', graph(0, [])],
  ['self loops and parallel edges', graph(4, [[0, 0], [0, 1], [0, 1], [1, 2], [2, 1], [2, 3], [3, 3]], true)],
  ['DSL branches', current.parseFlowText('start[开始] -->|分支| a[甲]\nstart --> b[乙]\na --> end[结束]\nb --> end')],
  ['Mermaid subgraphs', current.parseFlowText(`flowchart TD
    subgraph Manager["管理侧：独立签发工具"]
        Key["加密保存的签名私钥"] --> Issuer["Rust 发卡工具"]
    end
    Issuer --> Token["带数字签名的授权卡密"]
    subgraph Client["CardGuard 主进程"]
        UI["C++ / Qt 桌面界面"]
        Rust["Rust 授权校验静态库"]
        Policy["xollvm 虚拟化的策略函数"]
        PublicKey["编译时嵌入的公钥"]
        UI <-->|"C ABI 调用与返回"| Rust
        UI <-->|"最终授权判断"| Policy
        PublicKey --> Rust
    end
    Token -->|"用户输入"| UI
    System["本机设备标识与系统时间"] --> Rust`)],
  ['Mermaid labelled edge', current.parseFlowText('graph LR\n  A[甲] -- 完成 --> B[乙]\n  B --> C')],
  ['maximum dense cycle', denseCycle],
  ['maximum DAG', maxDag],
];
const mermaid = fixtures.find(([name]) => name === 'Mermaid subgraphs')[1];
assert.equal(mermaid.nodes.length, 8, 'Mermaid: node count');
assert.equal(mermaid.edges.length, 9, 'Mermaid: bidirectional arrows became two edges');
assert.equal(JSON.stringify(mermaid.groups), JSON.stringify([
  { id: 'Manager', label: '管理侧：独立签发工具', parent: '' },
  { id: 'Client', label: 'CardGuard 主进程', parent: '' },
]), 'Mermaid: subgraph labels');
assert.equal(mermaid.nodes.find(node => node.id === 'UI').group, 'Client', 'Mermaid: node group');
assert.equal(mermaid.edges.find(edge => edge.source === 'UI' && edge.target === 'Rust').label, 'C ABI 调用与返回');
assert.equal(fixtures.find(([name]) => name === 'Mermaid labelled edge')[1].edges[0].label, '完成', 'Mermaid: -- label --> form');
for (const name of [
  'artex-exploration-graph-task-8-20261022T070916Z-redacted.json',
  'artex-broadcast-task-8-20261022T055749Z-redacted.json',
]) {
  const data = fs.readFileSync(path.join(root, 'public/img/book/a-fun-guide-to-exploring-binaries', name), 'utf8');
  fixtures.push([name, current.readFlowFile(data)]);
}
// Exercise varied SCCs, self loops, isolated nodes, duplicate edges and stable ties.
let seed = 0x60c0de;
const random = max => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
for (let sample = 0; sample < 40; sample++) {
  const size = 1 + random(36);
  const pairs = Array.from({ length: random(size * 4 + 1) }, () => [random(size), random(size)]);
  fixtures.push([`seeded graph ${sample + 1}`, graph(size, pairs, sample < 5)]);
}

for (const [name, input] of fixtures) {
  const before = JSON.stringify(input);
  const actual = current.layoutFlow(input);
  assert.equal(JSON.stringify(input), before, `${name}: layout mutated its input`);
  assert.equal(actual.nodes.length, input.nodes.length, `${name}: missing node`);
  assert.equal(actual.edges.length, input.edges.length, `${name}: missing edge`);
  for (const positioned of actual.nodes) assert(Number.isFinite(positioned.x) && Number.isFinite(positioned.y), name);
  for (const edge of actual.edges) assert(!/NaN|Infinity/.test(edge.path), name);
  const repeated = JSON.stringify(current.layoutFlow(input));
  assert.equal(JSON.stringify(actual), repeated, `${name}: layout is not deterministic`);
  if (baseline) {
    // Compare every coordinate, route, label, dimension and copied metadata.
    assert.equal(JSON.stringify(actual), JSON.stringify(baseline.layoutFlow(input)), `${name}: layout changed`);
  }
}
assert.throws(() => current.readFlowFile({ nodes: [node('same'), node('same')], edges: [] }), /重复/);
assert.throws(() => current.layoutFlow(graph(1, [[0, 1]])), /不存在/);

function medianLayout(api, input) {
  api.layoutFlow(input);
  const times = [];
  for (let i = 0; i < 7; i++) {
    const start = performance.now();
    api.layoutFlow(input);
    times.push(performance.now() - start);
  }
  return Number(times.sort((a, b) => a - b)[Math.floor(times.length / 2)].toFixed(2));
}
const timings = {};
for (const [name, input] of fixtures.filter(([name]) => name === 'maximum dense cycle' || name.startsWith('artex-exploration'))) {
  const entry = { currentMs: medianLayout(current, input) };
  if (baseline) {
    entry.previousMs = medianLayout(baseline, input);
    entry.speedup = `${(entry.previousMs / entry.currentMs).toFixed(2)}x`;
  }
  timings[name] = entry;
}
console.log(JSON.stringify({
  fixturesPassed: fixtures.length,
  completeBaselineEquivalence: Boolean(baseline),
  validationChecksPassed: 2,
  timings,
}, null, 2));
