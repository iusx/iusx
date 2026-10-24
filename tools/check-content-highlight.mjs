// Run: node tools/check-content-highlight.mjs
// Exercise the installed MDC/Shiki implementation and the real Markdown examples.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = dirname(require.resolve('@nuxt/content'));
const mdcRoot = dirname(require.resolve('@nuxtjs/mdc', { paths: [contentRoot] }));
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const esbuild = require(require.resolve('esbuild', { paths: [nuxtRoot] }));
const shikiUrl = specifier => pathToFileURL(require.resolve(specifier)).href;
const { bundledLanguages, bundledLanguagesInfo } = await import(shikiUrl('shiki/langs'));
const { getHighlighterCore } = await import(shikiUrl('shiki/core'));
const { createShikiHighlighter } = await import(pathToFileURL(resolve(mdcRoot, 'runtime/highlighter/shiki.mjs')));

function compile(server) {
  return esbuild.buildSync({
    entryPoints: [resolve(root, 'mdc.config.ts')], bundle: true, write: false, platform: 'node',
    format: 'esm', target: 'es2022', minifySyntax: true, external: ['shiki/langs'],
    define: { 'import.meta.server': String(server) },
  }).outputFiles[0].text;
}
const serverCode = compile(true).replace('import("shiki/langs")', `import(${JSON.stringify(shikiUrl('shiki/langs'))})`);
const config = (await import(`data:text/javascript;base64,${Buffer.from(serverCode).toString('base64')}`)).default;
const clientCode = compile(false);
assert(!clientCode.includes('shiki/langs'), 'Server setup introduced the language registry into the client');
const languageSource = await readFile(resolve(root, 'utils/highlight-languages.ts'), 'utf8');
const languages = [...languageSource.matchAll(/"([^"]+)"/g)].map(match => match[1]);
assert(languages.length > 0);
const bundledLangs = {};
for (const name of languages) {
  const info = bundledLanguagesInfo.find(language => language.id === name || language.aliases?.includes(name));
  assert(info, `Unknown configured language: ${name}`);
  const loader = bundledLanguages[info.id];
  bundledLangs[info.id] = loader;
  for (const alias of info.aliases || []) bundledLangs[alias] = loader;
}

// Reproduce the actual Shiki 1.3 window: adding CSS invalidates Markdown until
// its embedded grammars finish reloading. No source patches or artificial delays.
const native = await getHighlighterCore({ langs: [bundledLangs.md], loadWasm: () => import(shikiUrl('shiki/wasm')) });
const css = await bundledLangs.css();
let loading = true;
const reload = native.loadLanguage(css.default).finally(() => loading = false);
let observations = 0;
let temporarilyMissing = 0;
while (loading && observations < 10000) {
  await Promise.resolve();
  observations++;
  try { native.getLanguage('md'); } catch { temporarilyMissing++; }
}
await reload;
assert(native.getLanguage('md'), 'The Markdown alias did not recover after language loading');

let core;
let languageLoadsAfterSetup = 0;
const highlighter = createShikiHighlighter({
  bundledLangs,
  bundledThemes: Object.fromEntries(['github-light', 'github-dark'].map(theme =>
    [theme, () => import(shikiUrl(`shiki/themes/${theme}.mjs`)).then(module => module.default)])),
  getMdcConfigs: async () => [{
    ...config,
    shiki: {
      ...config.shiki,
      async setup(highlighter) {
        await config.shiki.setup(highlighter);
        core = highlighter;
        const loadLanguage = core.loadLanguage.bind(core);
        core.loadLanguage = (...args) => { languageLoadsAfterSetup++; return loadLanguage(...args); };
      },
    },
  }],
});
// The Markdown parser normalizes Windows line endings before invoking Shiki.
const content = (await readFile(resolve(root, 'content/book/content-theme.md'), 'utf8')).replace(/\r\n?/g, '\n');
const examples = [...content.matchAll(/^```md[^\r\n]*\r?\n([\s\S]*?)^```[ \t]*$/gm)].map(match => match[1]);
assert(examples.length > 0, 'No real md examples were found');
const requests = examples.flatMap(code => [
  { lang: 'md', code, original: true },
  ...languages.map(lang => ({ lang, code: '# Heading\nconst value = 42;', original: false })),
]);
const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
const settled = await Promise.allSettled(requests.map(async request => {
  const result = await highlighter(request.code, request.lang, { default: 'github-light', 'dark-mode': 'github-dark' });
  if (request.original) {
    // MDC appends a newline inside each line span; Shiki also keeps separators
    // between those spans. Read each rendered line once instead of double-counting.
    const lines = result.tree.filter(node => node.type === 'element' && node.tagName === 'span');
    assert.equal(lines.map(node => text(node).replace(/\n$/, '')).join('\n').trimEnd(), request.code.trimEnd(), 'Highlighted example changed its text');
  }
  assert(result.className.includes('shiki'), 'Code did not receive syntax highlighting');
  return result;
}));
const failures = settled.filter(result => result.status === 'rejected');
assert.equal(failures.length, 0, failures.map(result => result.reason.stack).join('\n'));
for (const language of [...languages, 'md']) assert(core.getLoadedLanguages().includes(language), `Language was not preloaded: ${language}`);
assert.equal(languageLoadsAfterSetup, 0, 'Concurrent code blocks triggered another grammar reload');
console.log(JSON.stringify({
  nativeReloadWindow: { observations, temporarilyMissing },
  actualMarkdownExamples: examples.length,
  concurrentHighlightsPassed: requests.length,
  languageLoadsAfterSetup,
  clientLanguageRegistryAdded: false,
}, null, 2));
