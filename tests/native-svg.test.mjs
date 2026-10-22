import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { Comment, createSSRApp, h, Text } from 'vue';
import { nativeSvgAttributes, wrapNativeSvgNodes } from '../utils/native-svg.ts';

const require = createRequire(import.meta.url);
const vueEntry = require.resolve('vue');
const { renderToString } = require(require.resolve('@vue/server-renderer', { paths: [dirname(vueEntry)] }));
const contentRoot = dirname(require.resolve('@nuxt/content'));
const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
const { find, html } = await import(pathToFileURL(require.resolve('property-information', { paths: [mdcRoot] })).href);
const { parseMarkdown } = await import(pathToFileURL(`${mdcRoot}/runtime/parser/index.mjs`).href);
const { parseFragment } = await import(pathToFileURL(require.resolve('parse5', { paths: [mdcRoot] })).href);
const remarkMath = (await import('remark-math')).default;
const rehypeMathjax = (await import('rehype-mathjax')).default;
const { parse } = require(require.resolve('@vue/compiler-sfc', { paths: [dirname(vueEntry)] }));
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const componentPath = new URL('../components/content/NativeSvg.vue', import.meta.url);
const script = parse(readFileSync(componentPath, 'utf8')).descriptor.script.content
  .replace('"~/utils/native-svg"', JSON.stringify(fileURLToPath(new URL('../utils/native-svg.ts', import.meta.url))));
const compiled = esbuild.buildSync({
  stdin: { contents: script, loader: 'ts', resolveDir: fileURLToPath(new URL('..', import.meta.url)) },
  bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external',
}).outputFiles[0].text.replaceAll('"vue"', JSON.stringify(pathToFileURL(vueEntry).href));
const NativeSvg = (await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).default;

const text = value => ({ type: 'text', value });
const element = (tag, children = [], props = {}) => ({ type: 'element', tag, props, children });
const nodes = node => [node, ...(node.children || []).flatMap(nodes)];
// This is MDC's existing property serialization, with native string tags so
// the comparison does not intentionally flood the test log with warnings.
function previousNativeRender(node) {
  if (node.type === 'text') return h(Text, node.value);
  if (node.type === 'comment') return h(Comment, node.value);
  const attributes = Object.fromEntries(Object.entries(node.props || {}).map(([key, value]) => [
    find(html, key).attribute,
    Array.isArray(value) && value.every(item => typeof item === 'string') ? value.join(' ') : value,
  ]));
  return h(node.tag, attributes, (node.children || []).map(previousNativeRender));
}

test('SVG property aliases preserve native namespace, data, ARIA and case-sensitive attributes', () => {
  const properties = {
    xmlnsXLink: 'http://www.w3.org/1999/xlink', xLinkHref: '#glyph-1', className: ['math', 'formula'],
    dataMmlNode: 'math', ariaHidden: 'true', xmlLang: 'zh', xmlSpace: 'preserve',
    viewBox: '0 -100 600 300', preserveAspectRatio: 'xMidYMid meet', 'stroke-width': '0',
    style: 'vertical-align: -0.5ex;', tabIndex: -1,
  };
  const expected = Object.fromEntries(Object.entries(properties).map(([key, value]) => [
    find(html, key).attribute, Array.isArray(value) ? value.join(' ') : value,
  ]));
  assert.deepEqual(nativeSvgAttributes(properties), expected);
});

test('wrapping native SVGs preserves original trees and leaves bound or custom content intact', () => {
  const original = element('svg', [element('g', [element('text', [text('A < B & C')])])], { viewBox: '0 0 100 100' });
  const bound = element('svg', [element('path', [], { ':d': 'path' })]);
  const custom = element('svg', [element('custom-chart', [], { source: 'data' })]);
  const document = { type: 'root', children: [original, bound, custom, paragraph()] };
  function paragraph() { return element('p', [text('<svg>literal code text</svg>')]); }
  const snapshot = JSON.stringify(original);
  wrapNativeSvgNodes(document);
  assert.equal(document.children[0].tag, 'native-svg');
  assert.equal(document.children[0].props.tree, original);
  assert.deepEqual(document.children[0].children, []);
  assert.equal(JSON.stringify(original), snapshot);
  assert.equal(document.children[1], bound);
  assert.equal(document.children[2], custom);
  assert.equal(document.children[3].children[0].value, '<svg>literal code text</svg>');
  const first = JSON.stringify(document);
  wrapNativeSvgNodes(document);
  assert.equal(JSON.stringify(document), first);
});

test('actual MathJax SVGs render identically through NativeSvg without component resolution warnings', async t => {
  const source = readFileSync(new URL('../content/book/seven-languages-in-seven-weeks---bruce-a-tate.md', import.meta.url), 'utf8');
  const formulas = source.match(/\$\$[\s\S]*?\$\$/g);
  assert(formulas.length >= 4);
  const parsed = await parseMarkdown(formulas.join('\n\n'), {
    highlight: false,
    remark: { plugins: { 'remark-math': { instance: remarkMath } } },
    rehype: { plugins: { 'rehype-mathjax': { instance: rehypeMathjax } } },
  });
  const svgs = nodes(parsed.body).filter(node => node.tag === 'svg');
  const containers = nodes(parsed.body).filter(node => node.tag === 'mjx-container');
  const stylesheet = nodes(parsed.body).find(node => node.tag === 'style');
  assert(svgs.length >= 4);
  assert.equal(containers.length, svgs.length);
  assert(stylesheet);
  // Also exercise SVG text escaping and comments, which the formula fixture
  // might omit depending on the installed MathJax font representation.
  svgs.push(element('svg', [element('text', [text('A < B & "C"')]), { type: 'comment', value: 'svg-note' }], { viewBox: '0 0 20 20' }));
  const warnings = [];
  for (const svg of svgs) {
    const original = JSON.stringify(svg);
    const expected = await renderToString(createSSRApp({ render: () => previousNativeRender(svg) }));
    const app = createSSRApp({ render: () => h(NativeSvg, { tree: svg }) });
    app.config.warnHandler = warning => warnings.push(warning);
    const rendered = await renderToString(app);
    assert.equal(rendered, expected, 'native rendering changed SVG tags, attributes, styles or text');
    assert.equal(JSON.stringify(svg), original, 'renderer mutated the source SVG AST');
  }
  for (const container of containers) {
    const expected = await renderToString(createSSRApp({ render: () => previousNativeRender(container) }));
    const app = createSSRApp({ render: () => h(NativeSvg, { tree: container }) });
    app.config.warnHandler = warning => warnings.push(warning);
    assert.equal(await renderToString(app), expected);
  }
  const css = stylesheet.children.map(child => child.value || '').join('');
  const styleHtml = await renderToString(createSSRApp({ render: () => h(NativeSvg, { tree: stylesheet }) }));
  assert(!styleHtml.includes('&quot;'), 'CSS quotes must remain raw inside style elements');
  assert.equal(parseFragment(styleHtml).childNodes[0].childNodes[0].value, css);
  wrapNativeSvgNodes(parsed.body);
  const wrappers = nodes(parsed.body).filter(node => node.tag === 'native-svg');
  assert.equal(wrappers.filter(node => node.props.tree.tag === 'mjx-container').length, containers.length);
  assert.equal(wrappers.filter(node => node.props.tree === stylesheet).length, 1);
  assert(!nodes(parsed.body).some(node => ['mjx-container', 'svg', 'g', 'use'].includes(node.tag)), 'MDC can still recurse into native formula tags');
  assert.equal(warnings.length, 0, warnings.join('\n'));
  const mathNodes = svgs.flatMap(nodes);
  assert(mathNodes.some(node => node.tag === 'path' && node.props.id));
  assert(mathNodes.some(node => node.tag === 'use' && node.props.xLinkHref));
  t.diagnostic(`Compared ${svgs.length - 1} real MathJax SVGs and one escaped-text sample`);
});

test('generated MathJax CSS cannot terminate its style element or inject markup', async () => {
  const css = '\nmjx-container[jax="SVG"] { direction: ltr; }\n'
    + 'mjx-container::after { content: "</StYlE><script>alert(1)</script>"; }';
  const stylesheet = element('style', [text(css)]);
  const rendered = await renderToString(createSSRApp({ render: () => h(NativeSvg, { tree: stylesheet }) }));
  const parsed = parseFragment(rendered);
  assert.equal(parsed.childNodes.length, 1);
  assert.equal(parsed.childNodes[0].tagName, 'style');
  assert.equal(parsed.childNodes[0].childNodes.length, 1);
  assert.equal(parsed.childNodes[0].childNodes[0].value,
    css.replace('</StYlE>', '<\\/StYlE>'));
  assert(!rendered.includes('&quot;'));
  const unrelated = { type: 'root', children: [element('style', [text('body { color: red; }')])] };
  wrapNativeSvgNodes(unrelated);
  assert.equal(unrelated.children[0].tag, 'style', 'raw CSS handling expanded beyond generated MathJax styles');
});
