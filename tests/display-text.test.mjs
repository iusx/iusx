import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { displayText } from '../utils/display-text.ts';
import { readTimelineFile } from '../utils/content-timeline.ts';

const require = createRequire(import.meta.url);
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const vueEntry = require.resolve('vue', { paths: [nuxtRoot] });
const { createSSRApp, h } = require(vueEntry);
const { renderToString } = require(require.resolve('@vue/server-renderer', { paths: [dirname(vueEntry)] }));
const contentRoot = dirname(require.resolve('@nuxt/content'));
const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
const { parseFragment } = await import(pathToFileURL(require.resolve('parse5', { paths: [mdcRoot] })).href);

const parsedText = (node) => node.nodeName === '#text'
  ? node.value
  : (node.childNodes || []).map(parsedText).join('');
const render = (build, text) => renderToString(createSSRApp({ render: () => build(text) }));

test('display normalization removes only NUL and normalizes carriage returns', () => {
  const source = '前\0后\r\n第二行\r第三行\n末行\t字面\\u0000\\r\\n';
  const expected = '前后\n第二行\n第三行\n末行\t字面\\u0000\\r\\n';
  assert(displayText(source) === expected, 'normalization changed unrelated text or introduced visible escapes');
  assert(displayText(expected) === expected, 'normalization must be idempotent');
  assert.equal(displayText(42), '42');
});

test('Vue SSR text survives real HTML parsing in timeline and SVG contexts', async () => {
  const raw = 'before\0after\r\nnext\rrow\n尾部<&>"';
  const oldHtml = await render(value => h('p', value), raw);
  assert(parsedText(parseFragment(oldHtml)) !== raw, 'fixture must reproduce the original hydration mismatch');

  const normalized = displayText(raw);
  const contexts = [
    ['timeline body', value => h('p', value)],
    ['flow detail', value => h('dl', [h('dd', value)])],
    ['edge label', value => h('svg', [h('text', value)])],
    ['node label', value => h('svg', [h('foreignObject', [h('div', { xmlns: 'http://www.w3.org/1999/xhtml' }, value)])])],
    ['outline label', value => h('button', { 'aria-label': value }, value)],
  ];
  for (const [name, build] of contexts) {
    const parsed = parseFragment(await render(build, normalized));
    assert(parsedText(parsed) === normalized, `${name}: parsed SSR text differs from client display text`);
    if (name === 'outline label') {
      assert(parsed.childNodes[0].attrs.find(attribute => attribute.name === 'aria-label')?.value === normalized,
        'outline label: parsed aria-label differs from client display text');
    }
  }
});

test('real timeline JSON control characters render consistently without changing source records', async (t) => {
  const filename = new URL('../public/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json', import.meta.url);
  const document = JSON.parse(readFileSync(filename, 'utf8'));
  const originalDocument = JSON.stringify(document);
  const entries = readTimelineFile(document);
  const originalEntries = JSON.stringify(entries);
  let checked = 0;
  for (const [index, entry] of entries.entries()) {
    const fields = ['time', 'datetime', 'ago', 'kind', 'number', 'status', 'priority', 'title', 'text']
      .map(key => [key, String(entry[key])]);
    entry.details.forEach((detail, detailIndex) => {
      fields.push([`details.${detailIndex}.label`, detail.label], [`details.${detailIndex}.text`, detail.text]);
    });
    for (const [field, value] of fields) {
      if (!/[\0\r]/.test(value)) continue;
      const normalized = displayText(value);
      const html = await render(text => h('p', text), normalized);
      assert(parsedText(parseFragment(html)) === normalized, `entry ${index}, ${field}: SSR/client text mismatch`);
      checked++;
    }
  }
  assert(checked > 0, 'real JSON fixture no longer exercises control characters');
  assert(JSON.stringify(document) === originalDocument, 'display rendering mutated source JSON');
  assert(JSON.stringify(entries) === originalEntries, 'display rendering mutated timeline records');
  t.diagnostic(`Checked ${checked} control-character fields across ${entries.length} source records`);
});
