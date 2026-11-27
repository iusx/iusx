import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { Comment, Fragment, createSSRApp, h } from 'vue';
import { timelineGroupRange } from '../utils/timeline-group.ts';

const require = createRequire(import.meta.url);
const vueEntry = require.resolve('vue');
const { renderToString } = require(require.resolve('@vue/server-renderer', { paths: [dirname(vueEntry)] }));
const { parse, compileScript } = require(require.resolve('@vue/compiler-sfc', { paths: [dirname(vueEntry)] }));
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const contentRoot = dirname(require.resolve('@nuxt/content'));
const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
const { parseMarkdown } = await import(pathToFileURL(`${mdcRoot}/runtime/parser/index.mjs`).href);
const { parseFragment } = await import(pathToFileURL(require.resolve('parse5', { paths: [mdcRoot] })).href);

// Compile the actual Vue components and MDC renderer, keeping one shared Vue
// runtime so SSR exercises the same slot/prop path as the application.
async function loadComponent(path) {
  const filename = typeof path === 'string' ? path : fileURLToPath(path);
  const { descriptor, errors } = parse(readFileSync(filename, 'utf8'), { filename });
  assert.deepEqual(errors, []);
  const script = descriptor.scriptSetup
    ? compileScript(descriptor, { id: filename, inlineTemplate: true }).content
    : descriptor.script.content;
  const compiled = esbuild.buildSync({
    stdin: { contents: script, loader: 'ts', resolveDir: dirname(filename) },
    alias: { '~': fileURLToPath(new URL('..', import.meta.url)) },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    bundle: true, write: false, platform: 'node', format: 'esm', external: ['vue'],
  }).outputFiles[0].text.replaceAll('"vue"', JSON.stringify(pathToFileURL(vueEntry).href));
  return (await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).default;
}

const TimelineGroup = await loadComponent(new URL('../components/content/timeline-group.vue', import.meta.url));
const TimelineItem = await loadComponent(new URL('../components/content/timeline-item.vue', import.meta.url));
const TextTimeline = await loadComponent(new URL('../components/content/text-timeline.vue', import.meta.url));
const MDCRenderer = await loadComponent(`${mdcRoot}/runtime/components/MDCRenderer.vue`);
const entry = datetime => h(TimelineItem, { datetime });
const walk = node => [node, ...(node.children || node.childNodes || []).flatMap(walk)];
const hasClass = (node, name) => node.attrs?.some(attr => attr.name === 'class' && attr.value.split(/\s+/).includes(name));
const textContent = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(textContent).join('');

test('group range uses the earliest and latest written calendar dates, independent of order or timezone', () => {
  assert.deepEqual(timelineGroupRange([
    entry('2026-11-10T23:59:59-12:00'),
    entry('2026-11-03T07:50:00+08:00'),
    entry('2026-10-28T00:01:00+14:00'),
  ]), { start: '2026-10-28', end: '2026-11-10', days: 13 });
  assert.deepEqual(timelineGroupRange([entry('2026-03-08T01:30:00-05:00'), entry('2026-03-09T01:30:00-04:00')]),
    { start: '2026-03-08', end: '2026-03-09', days: 1 });
});

test('group duration handles same-day, leap-day and year boundaries', () => {
  for (const [start, end, days] of [
    ['2026-11-10', '2026-11-10', 0],
    ['2024-02-28', '2024-03-01', 2],
    ['2026-02-28', '2026-03-01', 1],
    ['2026-12-31', '2027-01-01', 1],
  ]) {
    assert.deepEqual(timelineGroupRange([entry(start), entry(end)]), { start, end, days });
  }
});

test('invalid or absent dates do not create misleading durations', () => {
  const invalid = [undefined, '', '11-10', 'not a date', '2026-02-29', '2026-04-31', '2026-13-01', '2026-11-10T25:00:00Z'];
  assert.equal(timelineGroupRange(invalid.map(entry)), undefined);
  assert.equal(timelineGroupRange([]), undefined);
  assert.deepEqual(timelineGroupRange([...invalid.map(entry), entry('2026-11-10')]),
    { start: '2026-11-10', end: '2026-11-10', days: 0 });
});

test('explicit boundaries override inferred dates and reject invalid or reversed ranges', () => {
  const children = [entry('2026-10-28'), entry('2026-11-10')];
  assert.deepEqual(timelineGroupRange(children, '2026-10-30', '2026-11-12'),
    { start: '2026-10-30', end: '2026-11-12', days: 13 });
  assert.deepEqual(timelineGroupRange(children, undefined, '2026-11-11'),
    { start: '2026-10-28', end: '2026-11-11', days: 14 });
  assert.deepEqual(timelineGroupRange([], '2026-10-28', '2026-11-10'),
    { start: '2026-10-28', end: '2026-11-10', days: 13 });
  assert.equal(timelineGroupRange(children, 'invalid'), undefined);
  assert.equal(timelineGroupRange(children, undefined, ''), undefined);
  assert.equal(timelineGroupRange(children, '2026-11-11', '2026-11-10'), undefined);
});

test('fragments and native wrappers contribute dates without executing item body or details slots', () => {
  let slotCalls = 0;
  const hiddenDate = () => { slotCalls++; return [h('time', { datetime: '2030-01-01' })]; };
  const children = [
    h(Comment), null, false,
    h(Fragment, null, [h('div', null, [entry('2026-10-28')])]),
    h(TimelineItem, { datetime: '2026-11-10' }, { default: hiddenDate, details: hiddenDate }),
  ];
  assert.deepEqual(timelineGroupRange(children), { start: '2026-10-28', end: '2026-11-10', days: 13 });
  assert.equal(slotCalls, 0);
});

test('actual group SSR renders its title and duration, invokes its slot once, and supports title-only groups', async () => {
  let calls = 0;
  const children = () => { calls++; return [entry('2026-10-28'), entry('2026-11-10')]; };
  const warnings = [];
  const app = createSSRApp({ render: () => h(TimelineGroup, { title: '申请 & 审查' }, children) });
  app.config.warnHandler = warning => warnings.push(warning);
  const rendered = await renderToString(app);
  assert.equal(calls, 1);
  assert.match(rendered, /申请 &amp; 审查/);
  assert.match(rendered, /历时 13 天/);
  assert.match(rendered, /title="2026-10-28 — 2026-11-10"/);
  assert.deepEqual(warnings, []);
  const titleOnly = await renderToString(createSSRApp({
    render: () => h(TimelineGroup, { title: '等待审核', showDuration: false }, children),
  }));
  assert.match(titleOnly, /等待审核/);
  assert.doesNotMatch(titleOnly, /timeline-group-duration|历时/);
  const empty = await renderToString(createSSRApp({ render: () => h(TimelineGroup) }));
  assert.match(empty, /<summary[^>]*>.*事件分组/s);
  assert.doesNotMatch(empty, /NaN|历时/);
});

test('native group disclosure defaults open and can start collapsed without losing its summary or entries', async () => {
  for (const expanded of [undefined, false]) {
    const props = { title: '注册申请与实审', ...(expanded === undefined ? {} : { expanded }) };
    const rendered = await renderToString(createSSRApp({
      render: () => h(TimelineGroup, props, () => [entry('2026-10-28'), entry('2026-11-10')]),
    }));
    const dom = parseFragment(rendered);
    const disclosure = walk(dom).find(node => hasClass(node, 'timeline-group-disclosure'));
    assert.equal(disclosure.tagName, 'details');
    assert.equal(disclosure.attrs.some(attr => attr.name === 'open'), expanded !== false);
    const summary = disclosure.childNodes.find(node => node.tagName);
    assert.equal(summary.tagName, 'summary', 'native keyboard/click disclosure requires summary first');
    assert.match(textContent(summary), /注册申请与实审.*历时 13 天/s);
    assert.equal(walk(disclosure).filter(node => hasClass(node, 'timeline-item')).length, 2);
  }
});

test('real company Markdown renders its grouped and ungrouped events through MDC with the summary already in SSR', async () => {
  const source = readFileSync(new URL('../content/book/my-company.md', import.meta.url), 'utf8');
  const parsed = await parseMarkdown(source, { highlight: false });
  const timeline = walk(parsed.body).find(node => node.tag === 'text-timeline');
  assert(timeline);
  const group = timeline.children.find(node => node.tag === 'timeline-group');
  assert(group);
  const groupedEvents = group.children.filter(node => node.tag === 'timeline-item');
  const remainingEvents = timeline.children.filter(node => node.tag === 'timeline-item');
  assert.equal(groupedEvents.length, 13);
  assert.equal(groupedEvents[0].props.dateTime, '2026-10-28');
  assert.equal(groupedEvents.at(-1).props.dateTime, '2026-11-10');
  assert.equal(remainingEvents.length, 4);
  const warnings = [];
  const app = createSSRApp({ render: () => h(MDCRenderer, { body: { type: 'root', children: [timeline] }, prose: false }) });
  app.component('TextTimeline', TextTimeline);
  app.component('TimelineGroup', TimelineGroup);
  app.component('TimelineItem', TimelineItem);
  // Nuxt normally registers this sibling globally. It must never render for
  // the Markdown slot path under test.
  app.component('TimelineFileEntries', { setup() { throw new Error('Unexpected JSON timeline render'); } });
  app.config.warnHandler = warning => warnings.push(warning);
  const rendered = await renderToString(app);
  const dom = parseFragment(rendered);
  const groupElement = walk(dom).find(node => hasClass(node, 'timeline-group'));
  assert(groupElement);
  assert.match(textContent(groupElement), /注册申请与实审.*历时 13 天/s);
  assert.equal(walk(groupElement).filter(node => hasClass(node, 'timeline-item')).length, 13);
  assert.equal(walk(dom).filter(node => hasClass(node, 'timeline-item')).length, 17);
  assert.equal(walk(groupElement).filter(node => hasClass(node, 'timeline-details')).length, 1);
  assert.match(textContent(groupElement), /查看不予登记通知原文/);
  assert.doesNotMatch(textContent(groupElement), /顺丰上门拍照/);
  assert.match(textContent(dom), /顺丰上门拍照/);
  assert.deepEqual(warnings, []);
});
