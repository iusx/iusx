import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { activateArticleSection, registerArticleSection } from '../utils/article-activation.ts';

const require = createRequire(import.meta.url);
const vueEntry = require.resolve('vue');
const { createHydrationRenderer, h, nextTick, ref } = require(vueEntry);
const { parse } = require(require.resolve('@vue/compiler-sfc', { paths: [dirname(vueEntry)] }));
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const contentRoot = dirname(require.resolve('@nuxt/content'));
const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
const { parseFragment } = await import(pathToFileURL(require.resolve('parse5', { paths: [mdcRoot] })).href);
const source = readFileSync(new URL('../components/content/LazyArticleSection.vue', import.meta.url), 'utf8');
const { descriptor, errors } = parse(source);
assert.deepEqual(errors, []);
const compiled = esbuild.transformSync(descriptor.script.content, {
  loader: 'ts', format: 'esm', define: { 'import.meta.client': 'true' },
}).code
  .replace('from "vue"', `from ${JSON.stringify(pathToFileURL(vueEntry).href)}`)
  .replace('import { useNuxtApp } from "#imports";', 'const useNuxtApp = () => globalThis.__articleTestNuxtApp;')
  .replace('from "~/utils/article-activation"', `from ${JSON.stringify(new URL('../utils/article-activation.ts', import.meta.url).href)}`);
const LazyArticleSection = (await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).default;

// A small DOM host for Vue's real hydration/patch algorithm. innerHTML clears
// children even when assigned undefined, matching the browser behavior that
// previously erased freshly activated text in Vue 3.4.
class HostNode {
  constructor(nodeType, data = '') {
    // Browser DOM nodes are never made reactive by Vue refs.
    Object.defineProperty(this, '__v_skip', { value: true });
    this.nodeType = nodeType;
    this.data = data;
    this.parentNode = null;
    this.childNodes = [];
  }
  get parentElement() { return this.parentNode instanceof HostElement ? this.parentNode : null; }
  get firstChild() { return this.childNodes[0] || null; }
  get nextSibling() { return this.parentNode?.childNodes[this.parentNode.childNodes.indexOf(this) + 1] || null; }
  get textContent() { return this.nodeType === 3 ? this.data : this.childNodes.map(child => child.textContent).join(''); }
  set textContent(value) {
    this.childNodes.forEach(child => { child.parentNode = null; });
    this.childNodes = [];
    if (value) insert(new HostNode(3, String(value)), this);
  }
  hasChildNodes() { return this.childNodes.length > 0; }
}
class HostElement extends HostNode {
  constructor(tag) {
    super(1);
    this.tagName = tag.toUpperCase();
    this.namespaceURI = 'http://www.w3.org/1999/xhtml';
    this.attributes = {};
    this.props = {};
    this.dataset = {};
  }
  get children() { return this.childNodes.filter(node => node.nodeType === 1); }
  get innerHTML() { return this.childNodes.map(serialize).join(''); }
  set innerHTML(value) {
    this.textContent = '';
    for (const child of parseFragment(value == null ? '' : String(value)).childNodes) insert(fromParsed(child), this);
  }
  getAttribute(name) { return this.attributes[name] ?? null; }
  hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
  closest(selector) {
    const matches = selector === '.article-section'
      ? (this.attributes.class || '').split(/\s+/).includes('article-section')
      : ['BUTTON', 'INPUT'].includes(this.tagName) || this.attributes.role === 'button';
    return matches ? this : this.parentElement?.closest(selector) || null;
  }
  focus(options) { document.activeElement = this; this.focusOptions = options; }
  click() { this.props.onClick?.({ target: this }); }
}
function insert(child, parent, anchor = null) {
  remove(child);
  child.parentNode = parent;
  parent.childNodes.splice(anchor ? parent.childNodes.indexOf(anchor) : parent.childNodes.length, 0, child);
}
function remove(child) {
  if (child.parentNode) child.parentNode.childNodes.splice(child.parentNode.childNodes.indexOf(child), 1);
  child.parentNode = null;
}
function serialize(node) {
  if (node.nodeType === 3) return node.data;
  const tag = node.tagName.toLowerCase();
  const attrs = Object.entries(node.attributes).map(([name, value]) => ` ${name}="${value}"`).join('');
  return `<${tag}${attrs}>${node.innerHTML}</${tag}>`;
}
function fromParsed(node) {
  if (node.nodeName === '#text') return new HostNode(3, node.value);
  const element = new HostElement(node.tagName);
  for (const attribute of node.attrs || []) element.attributes[attribute.name] = attribute.value;
  for (const child of node.childNodes || []) insert(fromParsed(child), element);
  return element;
}
const renderer = createHydrationRenderer({
  insert, remove,
  createElement: tag => new HostElement(tag),
  createText: value => new HostNode(3, value),
  createComment: value => new HostNode(8, value),
  setText: (node, value) => { node.data = value; },
  setElementText: (element, value) => { element.textContent = value; },
  parentNode: node => node.parentNode,
  nextSibling: node => node.nextSibling,
  patchProp(element, key, previous, value) {
    element.props[key] = value;
    if (key === 'innerHTML' || key === 'textContent') element[key] = value;
    else if (key === 'style') element.attributes.style = Object.entries(value || {}).map(([name, entry]) => `${name}:${entry}`).join(';');
    else if (!key.startsWith('on')) {
      if (value == null) delete element.attributes[key];
      else element.attributes[key] = String(value);
    }
  },
});

function environment(t, { observer = true, hydrating = true } = {}) {
  const keys = ['Element', 'HTMLElement', 'SVGElement', 'document', 'IntersectionObserver', 'requestAnimationFrame', 'cancelAnimationFrame', '__articleTestNuxtApp'];
  const originals = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const frames = new Map();
  const observers = [];
  const roots = [];
  let frameId = 0;
  class Observer {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      this.disconnected = false;
      observers.push(this);
    }
    observe(element) { this.targets.add(element); }
    unobserve(element) { this.targets.delete(element); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
    intersect(elements, isIntersecting = true) { this.callback(elements.map(target => ({ target, isIntersecting }))); }
  }
  Object.assign(globalThis, {
    Element: HostElement,
    HTMLElement: HostElement,
    SVGElement: class extends HostElement {},
    document: {
      activeElement: null,
      getElementById: id => roots.flatMap(allNodes).find(node => node.attributes?.id === id) || null,
    },
    IntersectionObserver: observer ? Observer : undefined,
    requestAnimationFrame: callback => { const id = ++frameId; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => { frames.delete(id); },
    __articleTestNuxtApp: { isHydrating: hydrating },
  });
  const disposers = [];
  t.after(() => {
    disposers.reverse().forEach(dispose => dispose());
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return {
    frames, observers, roots, disposers,
    async frame() {
      const scheduled = [...frames.values()];
      frames.clear();
      scheduled.forEach(callback => callback(0));
      await nextTick();
    },
  };
}
const allNodes = node => [node, ...node.childNodes.flatMap(allNodes)];
function hydrateSection(env, slot, props = {}) {
  const container = new HostElement('main');
  const section = new HostElement('div');
  Object.assign(section.attributes, { id: 'test-section', class: 'article-section', style: '--article-section-height:1600px' });
  section.innerHTML = '<p>服务器保留的完整正文</p><button>复制</button>';
  insert(section, container);
  env.roots.push(container);
  const app = renderer.createApp({ render: () => h(LazyArticleSection, { id: 'test-section', ...props }, { default: slot }) });
  app.mount(container, true);
  env.disposers.push(() => { if (container._vnode) app.unmount(); });
  return { app, container, section, current: () => container.firstChild };
}

test('intersection activation schedules one section per frame and ignores invisible sections', async t => {
  const env = environment(t);
  const activated = [];
  const sections = [new HostElement('div'), new HostElement('div'), new HostElement('div')];
  sections.forEach((section, index) => env.disposers.push(registerArticleSection(section, async () => { activated.push(index); })));
  assert.equal(env.observers.length, 1);
  assert.equal(env.observers[0].options.rootMargin, '1200px 0px');
  env.observers[0].intersect(sections, false);
  assert.equal(env.frames.size, 0);
  env.observers[0].intersect(sections);
  assert.equal(env.frames.size, 1);
  await env.frame();
  assert.deepEqual(activated, [0]);
  assert.equal(env.frames.size, 1);
  await env.frame();
  assert.deepEqual(activated, [0, 1]);
  await env.frame();
  assert.deepEqual(activated, [0, 1, 2]);
  assert.equal(env.frames.size, 0);
});

test('fallback activation yields between sections and unregister cancels queued work', async t => {
  const env = environment(t, { observer: false });
  const activated = [];
  const unregister = [0, 1, 2].map(index => registerArticleSection(new HostElement('div'), async () => { activated.push(index); }));
  env.disposers.push(...unregister);
  await env.frame();
  assert.deepEqual(activated, [0]);
  unregister[1]();
  await env.frame();
  assert.deepEqual(activated, [0, 2]);
  const cancel = registerArticleSection(new HostElement('div'), async () => { activated.push('cancelled'); });
  env.disposers.push(cancel);
  unregister.forEach(dispose => dispose());
  cancel();
  assert.equal(env.frames.size, 0);
  await env.frame();
  assert.deepEqual(activated, [0, 2]);
});

test('hydration preserves server text without evaluating the slot; activation retains live children', async t => {
  const env = environment(t);
  let renders = 0;
  const text = ref('激活后的完整正文');
  const fixture = hydrateSection(env, () => {
    renders++;
    return [h('p', text.value), h('button', '复制')];
  });
  assert.equal(renders, 0);
  assert.equal(fixture.current(), fixture.section);
  assert.equal(fixture.current().textContent, '服务器保留的完整正文复制');
  assert.equal(fixture.current().dataset.articleState, 'static');
  const staticParagraph = fixture.section.firstChild;
  await activateArticleSection(staticParagraph);
  assert.equal(renders, 1);
  assert.equal(fixture.current().textContent, '激活后的完整正文复制');
  assert.equal(fixture.current().dataset.articleState, 'active');
  assert(!Object.hasOwn(fixture.current().props, 'innerHTML'), 'undefined innerHTML still destroys live DOM children in Vue 3.4');
  await activateArticleSection(fixture.current().firstChild);
  await fixture.current().props.onFocusin();
  assert.equal(renders, 1);
  text.value = '后续响应式更新仍然存在';
  await nextTick();
  assert.equal(fixture.current().textContent, '后续响应式更新仍然存在复制');
});

test('eager sections and client navigation render slots immediately', async t => {
  for (const options of [{ hydrating: true, eager: true }, { hydrating: false, eager: false }]) {
    await t.test(JSON.stringify(options), subtest => {
      const env = environment(subtest, options);
      let renders = 0;
      const fixture = hydrateSection(env, () => {
        renders++;
        return [h('p', '服务器保留的完整正文'), h('button', '复制')];
      }, { eager: options.eager });
      assert.equal(renders, 1);
      assert.equal(fixture.current().dataset.articleState, 'active');
      assert.equal(env.observers.length, 0);
      assert.equal(fixture.current().textContent, '服务器保留的完整正文复制');
    });
  }
});

test('unmounting a queued static section cancels work without evaluating its slot', async t => {
  const env = environment(t);
  let renders = 0;
  const fixture = hydrateSection(env, () => { renders++; return [h('p', 'never mount')]; });
  env.observers[0].intersect([fixture.section]);
  assert.equal(env.frames.size, 1);
  fixture.app.unmount();
  assert.equal(env.frames.size, 0);
  assert.equal(env.observers[0].disconnected, true);
  await env.frame();
  await activateArticleSection(fixture.section);
  assert.equal(renders, 0);
});

test('activation restores keyboard focus on the replacement control without scrolling', async t => {
  const env = environment(t);
  const fixture = hydrateSection(env, () => [h('p', '正文'), h('button', '复制')]);
  const oldButton = fixture.section.children[1];
  oldButton.focus();
  await fixture.section.props.onFocusin();
  const liveButton = fixture.current().children[1];
  assert.notEqual(liveButton, oldButton);
  assert.equal(document.activeElement, liveButton);
  assert.deepEqual(liveButton.focusOptions, { preventScroll: true });
});

test('the first click on a static control activates and reaches the live handler exactly once', async t => {
  const env = environment(t);
  let clicks = 0;
  let prevented = 0;
  let stopped = 0;
  const fixture = hydrateSection(env, () => [h('p', '正文'), h('button', { onClick: () => { clicks++; } }, '复制')]);
  await fixture.section.props.onClickCapture({
    target: fixture.section.children[1],
    preventDefault() { prevented++; },
    stopPropagation() { stopped++; },
  });
  assert.equal(clicks, 1);
  assert.equal(prevented, 1);
  assert.equal(stopped, 1);
  assert.equal(fixture.current().dataset.articleState, 'active');
});
