import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { SITE_SEO, canonicalUrl, documentSeo, parseSeoDate, resolveSeoImage, serializeSeoSchema } from '../utils/seo.ts';

const text = value => ({ type: 'text', value });
const element = (tag, children = [], props = {}) => ({ type: 'element', tag, props, children });
const paragraph = value => element('p', [text(value)]);
const document = children => ({ body: { type: 'root', children } });

test('canonical URLs use this site and discard query strings, fragments and trailing slashes', () => {
  for (const path of ['/', '/?utm_source=test#top', 'https://other.example/?utm_source=test']) {
    assert.equal(canonicalUrl(path), `${SITE_SEO.url}/`);
  }
  for (const path of ['/book/gimp/', '/book/gimp?sort=top#intro', 'https://other.example/book/gimp/?q=1#top']) {
    assert.equal(canonicalUrl(path), `${SITE_SEO.url}/book/gimp`);
  }
  assert.equal(canonicalUrl('/book/中文/'), `${SITE_SEO.url}/book/%E4%B8%AD%E6%96%87`);
});

test('image URLs follow the real layout roots and use only safe web URLs', () => {
  assert.equal(resolveSeoImage('gimp/1.png', '/book/gimp'), `${SITE_SEO.url}/img/book/gimp/1.png`);
  assert.equal(resolveSeoImage('sec/02/1.png', '/sec/github-misconfiguration'), `${SITE_SEO.url}/img/sec/02/1.png`);
  assert.equal(resolveSeoImage('/img/des/01/3.jpg', '/des/ienn'), `${SITE_SEO.url}/img/des/01/3.jpg`);
  assert.equal(resolveSeoImage('https://cdn.example/a.jpg?v=1', '/book/gimp'), 'https://cdn.example/a.jpg?v=1');
  assert.equal(resolveSeoImage(['first.jpg', 'second.jpg'], '/book/test'), `${SITE_SEO.url}/img/book/first.jpg`);
  assert.equal(resolveSeoImage('one.jpg,two.jpg', '/sec/test'), `${SITE_SEO.url}/img/one.jpg`);
  assert.equal(resolveSeoImage({ url: '/cover.png', alt: 'Cover' }, '/book/test'), `${SITE_SEO.url}/cover.png`);
  for (const image of ['', undefined, {}, [], 'javascript:alert(1)', 'data:image/svg+xml,test', '//other.example/a.jpg', '../private.jpg', 'https://', 'https://user:password@example.com/a.jpg', 'a\\b.png']) {
    assert.equal(resolveSeoImage(image, '/book/test'), `${SITE_SEO.url}/logo.png`);
  }
});

test('Chinese, Japanese and English titles and explicit metadata survive normalization', () => {
  for (const title of ['杀死一只知更鸟', 'すべてが F になる', 'GraphQL Misconfiguration in CWE-16 Github API']) {
    const page = documentSeo({ title, description: 'Readable description.', img: '/cover.png' }, '/book/example');
    assert.equal(page.title, title);
    assert.equal(page.description, 'Readable description.');
    assert.equal(page.image, `${SITE_SEO.url}/cover.png`);
    assert.equal(page.type, 'article');
  }
  const explicit = documentSeo({
    title: 'Article title', description: 'Article description', img: '/article.png',
    seo: { title: 'SEO title', description: '**SEO** description', image: '/seo.png', imageAlt: '封面', language: 'ja-JP' },
    head: { title: 'Head title', meta: [{ name: 'description', content: 'Head description' }] },
  }, '/book/example');
  assert.equal(explicit.title, 'SEO title');
  assert.equal(explicit.description, 'SEO description');
  assert.equal(explicit.image, `${SITE_SEO.url}/seo.png`);
  assert.equal(explicit.imageAlt, '封面');
  assert.equal(explicit.language, 'ja-JP');
});

test('existing head metadata and author fields remain supported', () => {
  const page = documentSeo({
    title: 'Fallback', img: '/fallback.png',
    head: { meta: [
      { property: 'og:title', content: 'Open Graph title' },
      { name: 'description', content: 'Head description' },
      { property: 'og:image', content: 'https://cdn.example/share.png' },
      { name: 'author', content: 'Author Name' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ] },
  }, '/sec/article');
  assert.equal(page.title, 'Open Graph title');
  assert.equal(page.description, 'Head description');
  assert.equal(page.image, 'https://cdn.example/share.png');
  assert.equal(page.author, 'Author Name');
  assert.equal(page.noindex, true);
  assert.equal(page.robots, 'noindex, nofollow, noarchive');
});

test('MDC summaries prefer text-sum including bound frontmatter references', () => {
  const page = documentSeo({ title: '文章', overview: '来自 frontmatter 的摘要。', ...document([
    element('main-content', [paragraph('First paragraph.'), element('text-sum', [], { ':desc': 'overview' })]),
  ]) }, '/sec/example');
  assert.equal(page.description, '来自 frontmatter 的摘要。');
  const direct = documentSeo({ title: '文章', ...document([
    element('book-content', [element('text-sum', [], { desc: 'A **short** summary.' }), paragraph('First paragraph.')]),
  ]) }, '/book/example');
  assert.equal(direct.description, 'A short summary.');
  const expression = documentSeo({ ...document([element('text-sum', [], { ':desc': 'process.env.SECRET' }), paragraph('Safe paragraph.')]) }, '/book/example');
  assert.equal(expression.description, 'Safe paragraph.');
});

test('paragraph excerpts skip code, scripts, HTML, JSON, flow nodes and headings', () => {
  const doc = { title: 'Safe article', ...document([
    element('book-content', [
      element('h2', [text('Heading should not become the description')]),
      element('pre', [paragraph('SECRET CODE')]),
      element('script', [paragraph('SECRET SCRIPT')]),
      { type: 'html', value: '<p>SECRET HTML</p>', children: [paragraph('SECRET HTML CHILD')] },
      { type: 'json', children: [paragraph('SECRET JSON')] },
      element('text-flow', [paragraph('SECRET FLOW')]),
      element('json-viewer', [paragraph('SECRET JSON VIEWER')]),
      element('lazy-article-section', [element('p', [
        text('A paragraph with '), element('strong', [text('bold')]), text(' and '), element('a', [text('a link')]),
        text('. '), element('code', [text('SECRET INLINE CODE')]), element('script', [text('SECRET INLINE SCRIPT')]),
      ])]),
    ]),
  ]) };
  const snapshot = JSON.stringify(doc);
  const page = documentSeo(doc, '/book/safe');
  assert.equal(page.description, 'A paragraph with bold and a link.');
  assert.equal(JSON.stringify(doc), snapshot, 'SEO extraction must not mutate the source document');
  const long = documentSeo({ ...document([paragraph('文章'.repeat(150))]) }, '/book/long');
  assert(Array.from(long.description).length <= 160);
  assert(long.description.endsWith('…'));
});

test('empty pages receive relevant fallback text and metadata-only design/link entries are noindex', () => {
  const book = documentSeo({ title: 'Gimp', director: 'The book author' }, '/book/gimp');
  assert.match(book.description, /Gimp/);
  assert.match(book.description, /阅读笔记/);
  assert.equal(book.author, 'ritsu');
  assert.equal(book.noindex, false);
  const home = documentSeo({}, '/');
  assert.equal(home.description, SITE_SEO.description);
  assert.equal(home.type, 'website');
  const design = documentSeo({ title: 'IENN Editor', director: 'Design Author', robots: 'index, nofollow' }, '/des/ienn');
  assert.equal(design.author, 'Design Author');
  assert.equal(design.noindex, true);
  assert.equal(design.robots, 'noindex, nofollow');
  const link = documentSeo({ name: 'mogeko' }, '/link/mogeko');
  assert.equal(link.title, 'mogeko');
  assert.equal(link.noindex, true);
  const fullArticle = documentSeo({ title: 'Design story', ...document([paragraph('An original design case study.')]) }, '/des/story');
  assert.equal(fullArticle.noindex, false);
});

test('dates require complete valid calendar days and retain explicit time zones', () => {
  assert.equal(parseSeoDate('2023.12.2'), '2023-12-02T00:00:00.000Z');
  assert.equal(parseSeoDate('2026-01-02'), '2026-01-02T00:00:00.000Z');
  assert.equal(parseSeoDate('2024/2/29'), '2024-02-29T00:00:00.000Z');
  assert.equal(parseSeoDate('2026-10-23T13:30:10+08:00'), '2026-10-23T05:30:10.000Z');
  assert.equal(parseSeoDate('2026-10-23T13:30:10.25Z'), '2026-10-23T13:30:10.250Z');
  for (const value of [undefined, '', '2026', 2026, '2026-02', '2023.2.29', '2026.13.2', '2026.4.31', '2026.0.1', '2026.1.0', '2026-02-30T10:00:00Z', '2026-01-02T24:00:00Z', '2026-01-02T12:60:00Z', 'tomorrow', new Date('invalid')]) {
    assert.equal(parseSeoDate(value), undefined, String(value));
  }
  const page = documentSeo({ title: 'Dates', time: '2026', publishedAt: '2026-01-02', updatedAt: '2026.10.23' }, '/book/dates');
  assert.equal(page.publishedTime, '2026-01-02T00:00:00.000Z');
  assert.equal(page.modifiedTime, '2026-10-23T00:00:00.000Z');
  assert.equal(documentSeo({ time: '2026' }, '/book/no-day').publishedTime, undefined);
});

test('explicit indexing restrictions remain effective and complete robots instructions are preserved', () => {
  for (const doc of [{ noindex: true }, { seo: { noindex: true } }, { robots: 'none' }, { seo: { robots: ['noindex', 'nofollow'] } }, { robots: { index: false, follow: false } }]) {
    assert.equal(documentSeo(doc, '/book/private').noindex, true);
  }
  const restricted = documentSeo({ seo: { noindex: true }, robots: 'index, nofollow, max-image-preview:large' }, '/book/private');
  assert.equal(restricted.noindex, true);
  assert.equal(restricted.robots, 'noindex, nofollow, max-image-preview:large');
  assert.equal(documentSeo({ robots: 'index, follow' }, '/book/public').noindex, false);
});

test('schema serialization cannot close the JSON-LD script or inject markup', () => {
  const payload = { headline: '</script><script>alert("x")</script>', description: 'A & B\u2028C\u2029D' };
  const serialized = serializeSeoSchema(payload);
  assert(!serialized.includes('<'));
  assert(!serialized.includes('>'));
  assert(!serialized.includes('&'));
  assert(!serialized.includes('\u2028'));
  assert(!serialized.includes('\u2029'));
  assert.deepEqual(JSON.parse(serialized), payload);
});

test('real content is handled through the installed MDC parser without Vue imports', async () => {
  const require = createRequire(import.meta.url);
  const contentRoot = dirname(require.resolve('@nuxt/content'));
  const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
  const { parseMarkdown } = await import(pathToFileURL(`${mdcRoot}/runtime/parser/index.mjs`).href);
  for (const [file, path, expectations] of [
    ['sec/github-misconfiguration.md', '/sec/github-misconfiguration', { title: 'GraphQL Misconfiguration in CWE-16 Github API', image: '/img/sec/02/1.png', date: '2023-12-04T00:00:00.000Z' }],
    ['book/to-kill-a-mockingbird.md', '/book/to-kill-a-mockingbird', { title: '杀死一只知更鸟', image: '/img/book/to-kill-a-mockingbird/1.jpg', date: undefined }],
    ['des/IENN-Editor.md', '/des/ienn-editor', { title: 'IENN-Editor', image: '/img/des/01/3.jpg', date: '2023-12-02T00:00:00.000Z', noindex: true }],
  ]) {
    const source = readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8');
    const parsed = await parseMarkdown(source, { highlight: false });
    const page = documentSeo({ ...parsed.data, body: parsed.body }, path);
    assert.equal(page.title, expectations.title);
    assert.equal(page.image, `${SITE_SEO.url}${expectations.image}`);
    assert.equal(page.publishedTime, expectations.date);
    if (expectations.noindex !== undefined) assert.equal(page.noindex, expectations.noindex);
    assert(page.description.length > 10);
    if (path.startsWith('/book/')) assert.equal(page.author, 'ritsu');
  }
});
