import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { groupLongBookSections } from '../utils/article-sections.ts';

const text = value => ({ type: 'text', value });
const element = (tag, children = [], props = {}) => ({ type: 'element', tag, props, children });
const paragraph = value => element('p', [text(value)]);
const bookDocument = children => ({ type: 'root', children: [element('book-content', children)] });
const body = document => document.children[0];
const flatten = document => body(document).children.flatMap(node => node.tag === 'lazy-article-section' ? node.children : [node]);
const allNodes = node => [node, ...(node.children || []).flatMap(allNodes)];
const textContent = node => node.type === 'text' ? node.value : (node.children || []).map(textContent).join('');
const longParagraphs = () => Array.from({ length: 90 }, (_, index) => paragraph(`paragraph ${index} ` + '文章 '.repeat(160)));

test('short book articles and long non-book content retain their exact structure', () => {
  for (const document of [bookDocument([paragraph('Short article')]), { type: 'root', children: [element('main-content', longParagraphs())] }]) {
    const original = JSON.stringify(document);
    const children = document.children[0].children;
    groupLongBookSections(document, 'content:book:short.md');
    assert.equal(JSON.stringify(document), original);
    assert.equal(document.children[0].children, children);
  }
});

test('large books preserve every original node, text, attribute and position', () => {
  const original = longParagraphs();
  const code = element('pre', [element('code', Array.from({ length: 700 }, (_, index) => element('span', [text(`token-${index}\n`)])))], { id: 'code-example' });
  const table = element('table', [element('tbody', [element('tr', [element('td', [text('Cell')])])])]);
  const graph = element('text-flow', [element('p', [text('Flow body')])], { src: 'graph.json' });
  original.splice(12, 0, code, table, graph);
  const snapshot = JSON.stringify(original);
  const document = bookDocument(original);
  groupLongBookSections(document, 'content:book:large.md');
  const sections = body(document).children;
  assert(sections.length > 2);
  assert(sections.every(section => section.tag === 'lazy-article-section'));
  assert.equal(sections[0].props.eager, true);
  assert(sections.slice(1).every(section => !Object.hasOwn(section.props, 'eager')));
  const restored = flatten(document);
  assert.equal(JSON.stringify(restored), snapshot);
  assert.equal(restored.length, original.length);
  restored.forEach((node, index) => assert.equal(node, original[index]));
  for (const intact of [code, table, graph]) {
    assert.equal(sections.filter(section => section.children.includes(intact)).length, 1);
  }
  assert(sections.every(section => Number.isFinite(section.props['estimated-height']) && section.props['estimated-height'] > 0));
});

test('legacy title and marker pairs remain adjacent in either order, including whitespace', () => {
  const children = [];
  const pairs = [];
  for (let index = 0; index < 40; index++) {
    children.push(paragraph('正文'.repeat(800)));
    const title = element('text-title', [], { ':t': `第 ${index} 章` });
    const marker = element('h2', [text(`Chapter ${index} 2`)], { id: `chapter-${index}`, 'data-toc-marker': 'true', 'data-toc-count': '2' });
    const pair = index % 2 ? [marker, text('\n'), title] : [title, text('\n'), marker];
    children.push(...pair, paragraph(`First paragraph ${index}`));
    pairs.push(pair);
  }
  const document = bookDocument(children);
  groupLongBookSections(document, 'content:book:pairs.md');
  for (const pair of pairs) {
    const section = body(document).children.find(node => node.children.includes(pair[0]));
    const position = section.children.indexOf(pair[0]);
    assert.deepEqual(section.children.slice(position, position + pair.length), pair);
    assert(section.children.some(node => node.tag === 'p'), 'heading was separated from its first body block');
  }
});

test('token-dense articles trigger sectioning even without thirty thousand characters', () => {
  const paragraphs = Array.from({ length: 40 }, () => paragraph(''));
  paragraphs.forEach(node => { node.children = Array.from({ length: 80 }, () => element('span', [text('x')])); });
  const document = bookDocument(paragraphs);
  assert(textContent(document).length < 30000);
  groupLongBookSections(document, 'content:book:tokens.md');
  assert(body(document).children.length > 2);
  assert(body(document).children.every(node => node.tag === 'lazy-article-section'));
  assert.deepEqual(flatten(document), paragraphs);
});

test('a title and its first paragraph cross a section budget together', () => {
  const title = element('text-title', [], { t: 'Boundary heading' });
  const firstParagraph = paragraph('新章节'.repeat(1100));
  const document = bookDocument([paragraph('前文'.repeat(600)), title, firstParagraph, ...longParagraphs()]);
  groupLongBookSections(document, 'content:book:boundary.md');
  const titleSection = body(document).children.find(section => section.children.includes(title));
  assert(titleSection.children.includes(firstParagraph));
  assert.equal(titleSection.children.indexOf(firstParagraph), titleSection.children.indexOf(title) + 1);
});

test('section IDs are deterministic, distinct across documents, collision-safe and idempotent', () => {
  const first = bookDocument(longParagraphs());
  const second = bookDocument(longParagraphs());
  const other = bookDocument(longParagraphs());
  groupLongBookSections(first, 'content:book:a.md');
  groupLongBookSections(second, 'content:book:a.md');
  groupLongBookSections(other, 'content:book:b.md');
  const ids = document => body(document).children.map(node => node.props.id);
  assert.deepEqual(ids(first), ids(second));
  assert(ids(first).every(id => !ids(other).includes(id)));
  const sectionNodes = body(first).children;
  const snapshot = JSON.stringify(first);
  groupLongBookSections(first, 'content:book:a.md');
  assert.equal(body(first).children, sectionNodes);
  assert.equal(JSON.stringify(first), snapshot);

  const collision = bookDocument(longParagraphs());
  body(collision).children[0].props.id = ids(first)[0];
  groupLongBookSections(collision, 'content:book:a.md');
  const allIds = allNodes(collision).map(node => node.props?.id).filter(Boolean);
  assert.equal(allIds.length, new Set(allIds).size);
  assert.equal(flatten(collision)[0].props.id, ids(first)[0]);
});

test('the real long article remains complete through the actual content transformer', async t => {
  const require = createRequire(import.meta.url);
  const contentRoot = dirname(require.resolve('@nuxt/content'));
  const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
  const parserUrl = pathToFileURL(`${mdcRoot}/runtime/parser/index.mjs`).href;
  const { parseMarkdown } = await import(parserUrl);
  const source = readFileSync(new URL('../content/book/seven-languages-in-seven-weeks---bruce-a-tate.md', import.meta.url), 'utf8');
  const parsed = await parseMarkdown(source, { highlight: false });
  const document = { _id: 'content:book:seven-languages-in-seven-weeks---bruce-a-tate.md', body: parsed.body };
  const originalText = textContent(document.body);
  const originalNodes = [...body(document.body).children];
  const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
  const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
  const compiled = esbuild.buildSync({
    entryPoints: [fileURLToPath(new URL('../transformers/book-headings.ts', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external',
  }).outputFiles[0].text
    .replace('"@nuxt/content/transformers"', JSON.stringify(pathToFileURL(require.resolve('@nuxt/content/transformers')).href))
    .replaceAll('"vue"', JSON.stringify(pathToFileURL(require.resolve('vue')).href));
  const transformer = (await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).default;
  assert.equal(transformer.transform(document), document);
  assert.equal(textContent(document.body), originalText);
  const restored = flatten(document.body);
  assert.equal(restored.length, originalNodes.length);
  restored.forEach((node, index) => assert.equal(node, originalNodes[index]));
  const sections = body(document.body).children;
  assert(sections.length > 10);
  for (const section of sections) {
    const significant = section.children.filter(node => node.type !== 'text' || node.value.trim());
    significant.forEach((node, index) => {
      if (!node.props?.['data-toc-marker']) return;
      assert([significant[index - 1], significant[index + 1]].some(sibling => sibling?.tag === 'text-title'), 'real legacy heading pair was split');
    });
  }
  t.diagnostic(`Preserved ${originalNodes.length} original blocks in ${sections.length} sections`);
});
