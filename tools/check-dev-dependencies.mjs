// Run: node --experimental-strip-types tools/check-dev-dependencies.mjs
// Use the installed Vite optimizer, including its native nested-dependency
// resolution and browser export conditions, without starting a browser/server.
import assert from 'node:assert/strict';
import { existsSync, realpathSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prepareDevDependencyIncludes } from '../utils/dev-dependencies.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rootRequire = createRequire(join(root, 'package.json'));
function packageJson(requireFrom, id) {
  // Some Nuxt packages export only an ESM entry, not package.json or require.
  // Find their metadata through their owner's actual Node resolution paths.
  const path = requireFrom.resolve.paths(id)
    .map(directory => join(directory, id, 'package.json')).find(existsSync);
  assert(path, `Missing installed package: ${id}`);
  return realpathSync(path);
}

const nuxtRequire = createRequire(packageJson(rootRequire, 'nuxt'));
const builderRequire = createRequire(packageJson(nuxtRequire, '@nuxt/vite-builder'));
const viteRoot = dirname(packageJson(builderRequire, 'vite'));
const vite = await import(pathToFileURL(join(viteRoot, 'dist/node/index.js')).href);
const contentManifestPath = packageJson(rootRequire, '@nuxt/content');
const mdcManifestPath = packageJson(createRequire(contentManifestPath), '@nuxtjs/mdc');
const contentManifest = JSON.parse(await readFile(contentManifestPath, 'utf8'));
const mdcManifest = JSON.parse(await readFile(mdcManifestPath, 'utf8'));
const injected = [
  'vue', 'vue-router', 'slugify', 'remark-gfm', 'remark-emoji', 'remark-mdc',
  'remark-rehype', 'rehype-raw', 'parse5', 'unist-util-visit', 'unified', 'debug',
];
const include = prepareDevDependencyIncludes(injected);
assert.deepEqual(prepareDevDependencyIncludes(include), include, 'Include normalization must be idempotent');
assert(prepareDevDependencyIncludes(['custom-plugin']).includes('custom-plugin'), 'Keep unrelated Vite includes');
for (const id of include) {
  if (id.startsWith('@nuxt/content > @nuxtjs/mdc > ')) {
    assert(mdcManifest.dependencies[id.split(' > ').at(-1)], `MDC does not own ${id}`);
  } else if (id.startsWith('@nuxt/content > ')) {
    assert(contentManifest.dependencies[id.split(' > ').at(-1)], `Content does not own ${id}`);
  }
}

const tempRoot = resolve(root, '.temp');
await mkdir(tempRoot, { recursive: true });
const cacheDir = await mkdtemp(join(tempRoot, 'vite-dependencies-test-'));
const warnings = [];
const logger = vite.createLogger('silent');
const originalWarn = logger.warn;
logger.warn = (message, ...options) => { warnings.push(message); originalWarn(message, ...options); };
try {
  const config = await vite.resolveConfig({
    root, configFile: false, envFile: false, cacheDir, customLogger: logger,
    resolve: { dedupe: ['vue', 'vue-router'] },
    optimizeDeps: { include, entries: [], noDiscovery: true },
  }, 'serve');
  const metadata = await vite.optimizeDeps(config, true);
  for (const id of include) assert(metadata.optimized[id]?.src, `Vite did not pre-bundle ${id}`);
  assert.equal(warnings.filter(message => /Failed to resolve dependency|Cannot optimize dependency/.test(message)).length, 0, warnings.join('\n'));
  const debug = metadata.optimized['@nuxt/content > @nuxtjs/mdc > debug'];
  assert(debug.src.endsWith('/debug/src/browser.js'), 'Keep the browser export when optimizing debug');
  console.log(JSON.stringify({ vite: vite.version, prebundled: include.length, missingDependencies: 0, browserExportsPreserved: true }, null, 2));
} finally {
  // Only remove this test's freshly created, verified workspace cache folder.
  assert(cacheDir.startsWith(tempRoot + sep) && cacheDir !== tempRoot);
  await rm(cacheDir, { recursive: true, force: true });
}
