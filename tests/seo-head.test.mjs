import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Resolve the installed transitive packages through Nuxt: this checkout does
// not require top-level Vue, Unhead or esbuild links to run the SSR checks.
const require = createRequire(import.meta.url);
const nuxtRequire = createRequire(require.resolve('nuxt/package.json'));
const { createHead } = nuxtRequire('@unhead/vue');
const { renderSSRHead } = nuxtRequire('@unhead/ssr');
const { build } = nuxtRequire('esbuild');
const { outputFiles } = await build({
  stdin: {
    contents: `export * from './utils/seo.ts'; export * from './utils/seo-head.ts'; export * from './utils/seo-pages.ts';`,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
    sourcefile: 'seo-head-test-entry.ts',
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { SITE_SEO, buildSeoHead, canonicalUrl, documentSeo, routeSeo } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
);

const decode = value => value.replace(/&(quot|apos|amp|lt|gt|#\d+|#x[\da-f]+);/gi, (_, entity) => {
  if (entity.startsWith('#')) return String.fromCodePoint(
    entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)),
  );
  return { quot: '"', apos: "'", amp: '&', lt: '<', gt: '>' }[entity.toLowerCase()];
});
const attributes = source => Object.fromEntries(
  [...source.matchAll(/([^\s=]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(([, name, , value]) => [name, decode(value)]),
);
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b((?:"[^"]*"|'[^']*'|[^'">])*)>`, 'g'))].map(match => attributes(match[1]));
const scripts = html => [...html.matchAll(/(?:^|\n)<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .map(([, attrs, content]) => ({ ...attributes(attrs), content }));
const metadata = (html, name) => tags(html, 'meta').filter(tag => (tag.name || tag.property) === name);
const meta = (html, name) => {
  const entries = metadata(html, name);
  assert.equal(entries.length, 1, `exactly one ${name} meta tag`);
  return entries[0].content;
};
const title = html => {
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)];
  assert.equal(titles.length, 1, 'exactly one document title');
  return decode(titles[0][1]);
};
const schema = html => {
  const entries = scripts(html).filter(script => script.type === 'application/ld+json' && script.content.includes('"@graph"'));
  assert.equal(entries.length, 1, 'exactly one generated SEO graph');
  return JSON.parse(entries[0].content);
};
const schemaNode = (html, type) => schema(html)['@graph'].find(node => node['@type'] === type);

function assertPageHead(html, page, path) {
  const fullTitle = title(html);
  assert(fullTitle.includes(page.title));
  assert.equal(meta(html, 'description'), page.description);
  const canonicals = tags(html, 'link').filter(link => link.rel === 'canonical');
  assert.equal(canonicals.length, 1, 'exactly one canonical link');
  assert.equal(canonicals[0].href, canonicalUrl(path));
  assert.equal(meta(html, 'og:title'), fullTitle);
  assert.equal(meta(html, 'twitter:title'), fullTitle);
  assert.equal(meta(html, 'og:description'), page.description);
  assert.equal(meta(html, 'twitter:description'), page.description);
  assert.equal(meta(html, 'og:url'), canonicalUrl(path));
  assert.equal(meta(html, 'og:site_name'), SITE_SEO.name);
  assert.equal(meta(html, 'og:type'), page.type || 'website');
  assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
  assert.equal(meta(html, 'og:image'), meta(html, 'twitter:image'));
  assert.match(meta(html, 'og:image'), /^https:\/\//);
  assert.equal(meta(html, 'og:image:alt'), meta(html, 'twitter:image:alt'));
  const graph = schema(html);
  assert.equal(graph['@context'], 'https://schema.org');
  assert.equal(schemaNode(html, 'WebSite').url, `${SITE_SEO.url}/`);
  assert.equal(schemaNode(html, 'WebPage').url, canonicalUrl(path));
  assert.equal(schemaNode(html, 'WebPage').name, fullTitle);
  assert.equal(schemaNode(html, 'BreadcrumbList').itemListElement.at(-1).item, canonicalUrl(path));
}

test('every static route renders one complete search and social head through Unhead SSR', async () => {
  const routes = ['/', '/about', '/des', '/book', '/sec', '/plan', '/link', '/tools/color', '/tools/kcal', '/tools/money', '/test/qc'];
  const titles = new Set();
  const descriptions = new Set();
  for (const path of routes) {
    const page = routeSeo(path);
    const head = createHead();
    head.push(buildSeoHead(page, `${path === '/' ? '' : path}/?utm_source=test#intro`));
    const { headTags, htmlAttrs } = await renderSSRHead(head);
    assertPageHead(headTags, page, path);
    titles.add(title(headTags));
    descriptions.add(meta(headTags, 'description'));
    assert.match(htmlAttrs, /lang="zh-CN"/);
    assert.equal(meta(headTags, 'robots').includes('noindex'), path.startsWith('/test/'));
    assert.equal(metadata(headTags, 'article:published_time').length, 0);
    assert.equal(metadata(headTags, 'article:modified_time').length, 0);
    assert.equal(schemaNode(headTags, 'BlogPosting'), undefined);
  }
  assert.equal(titles.size, routes.length, 'static routes have distinct titles');
  assert.equal(descriptions.size, routes.length, 'static routes have relevant distinct descriptions');
});

test('article metadata replaces global defaults and preserves custom head entries without duplicates', async () => {
  const path = '/book/seo-example';
  const customHead = {
    title: 'Legacy title',
    htmlAttrs: { dir: 'ltr' },
    meta: [
      { name: 'description', content: 'Legacy description' },
      { property: 'og:title', content: 'Legacy share title' },
      { name: 'keywords', content: 'design, reading' },
      { name: 'custom-article', content: 'preserve this' },
    ],
    link: [{ rel: 'canonical', href: 'https://old.example/wrong' }, { rel: 'stylesheet', href: '/article.css' }],
    script: [{ key: 'article-widget', src: '/article-widget.js', defer: true }],
  };
  const page = documentSeo({
    title: '文章标题', description: '文章摘要与独立的阅读笔记。', img: 'example/cover.jpg',
    time: '2026.10.20', updatedAt: '2026.10.23', author: 'Article Author',
    seo: { title: '文章的 SEO 标题', description: '用于搜索与分享的文章摘要。' },
  }, path);
  const head = createHead();
  head.push(buildSeoHead(routeSeo(path), path));
  head.push(buildSeoHead(page, path, customHead));
  const { headTags, htmlAttrs } = await renderSSRHead(head);
  assertPageHead(headTags, page, path);
  assert.equal(title(headTags), `${page.title} - ${SITE_SEO.name}`);
  assert.equal(meta(headTags, 'custom-article'), 'preserve this');
  assert.equal(meta(headTags, 'keywords'), 'design, reading');
  assert.equal(meta(headTags, 'author'), 'Article Author');
  assert.equal(meta(headTags, 'article:published_time'), '2026-10-20T00:00:00.000Z');
  assert.equal(meta(headTags, 'article:modified_time'), '2026-10-23T00:00:00.000Z');
  assert.equal(meta(headTags, 'og:image'), `${SITE_SEO.url}/img/book/example/cover.jpg`);
  assert.equal(tags(headTags, 'link').filter(link => link.href === '/article.css').length, 1);
  assert.equal(scripts(headTags).filter(script => script.src === '/article-widget.js').length, 1);
  assert.match(htmlAttrs, /dir="ltr"/);
  const article = schemaNode(headTags, 'BlogPosting');
  assert.equal(article.headline, page.title);
  assert.equal(article.datePublished, page.publishedTime);
  assert.equal(article.dateModified, page.modifiedTime);
  assert.deepEqual(schemaNode(headTags, 'BreadcrumbList').itemListElement.map(item => item.item), [
    canonicalUrl('/'), canonicalUrl('/book'), canonicalUrl(path),
  ]);
  assert(!headTags.includes('Legacy description'));
  assert(!headTags.includes('https://old.example/wrong'));
});

test('disposing an article and switching routes removes article dates, schema and custom metadata', async () => {
  const head = createHead();
  const path = '/sec/previous-report';
  const defaults = head.push(buildSeoHead(routeSeo(path), path));
  const article = head.push(buildSeoHead(documentSeo({
    title: 'Previous report', description: 'Previous article description.',
    time: '2026.10.20', updatedAt: '2026.10.23',
  }, path), path, { meta: [{ name: 'previous-article', content: 'remove me' }] }));
  assert(schemaNode((await renderSSRHead(head)).headTags, 'BlogPosting'));
  article.dispose();
  const nextPath = '/about';
  const nextPage = routeSeo(nextPath);
  defaults.patch(buildSeoHead(nextPage, nextPath));
  const { headTags } = await renderSSRHead(head);
  assertPageHead(headTags, nextPage, nextPath);
  for (const key of ['article:published_time', 'article:modified_time', 'article:section', 'article:author', 'previous-article']) {
    assert.equal(metadata(headTags, key).length, 0, `${key} must not survive navigation`);
  }
  assert.equal(schemaNode(headTags, 'BlogPosting'), undefined);
  assert(!headTags.includes('Previous report'));
  assert(!headTags.includes('previous-report'));
});

test('website metadata never emits article date properties and undated articles omit dates', async () => {
  for (const page of [
    { ...routeSeo('/about'), publishedTime: '2026-10-20T00:00:00.000Z', modifiedTime: '2026-10-23T00:00:00.000Z' },
    documentSeo({ title: 'Undated article', description: 'This article has no publication date.', time: '2026' }, '/book/undated'),
  ]) {
    const head = createHead();
    head.push(buildSeoHead(page, '/book/undated'));
    const { headTags } = await renderSSRHead(head);
    assert.equal(metadata(headTags, 'article:published_time').length, 0);
    assert.equal(metadata(headTags, 'article:modified_time').length, 0);
    const posting = schemaNode(headTags, 'BlogPosting');
    assert.equal(posting?.datePublished, undefined);
    assert.equal(posting?.dateModified, undefined);
  }
});

test('rendered JSON-LD safely preserves hostile text and remains parseable', async () => {
  const page = {
    title: '</script><script>escape()</script>',
    description: 'A & B\u2028C\u2029D <tag>',
    type: 'article',
  };
  const head = createHead();
  head.push(buildSeoHead(page, '/book/safe-schema'));
  const { headTags } = await renderSSRHead(head);
  assertPageHead(headTags, page, '/book/safe-schema');
  const generated = scripts(headTags).find(script => script.type === 'application/ld+json');
  assert(!/[<>&\u2028\u2029]/.test(generated.content));
  assert.equal(schemaNode(headTags, 'BlogPosting').headline, page.title);
  assert.equal(schemaNode(headTags, 'BlogPosting').description, page.description);
  assert.equal(scripts(headTags).length, 1, 'content cannot create another script element');
});
