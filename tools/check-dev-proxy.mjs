// Run after installing the proxy patch: node tools/check-dev-proxy.mjs
// Diagnose the unpatched dependency without changing it: add --compare.
// No dev server, generated Nuxt directory, network connection or extra package is needed.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Socket } from 'node:net';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const nuxtRoot = dirname(require.resolve('nuxt/package.json'));
const nitroRoot = dirname(require.resolve('nitropack/package.json', { paths: [nuxtRoot] }));
const httpxyCjs = require.resolve('httpxy', { paths: [nitroRoot] });
const httpxyEsm = httpxyCjs.replace(/\.cjs$/, '.mjs');
const nuxiBin = require.resolve('nuxi/cli', { paths: [nuxtRoot] });
const nuxiChunks = join(dirname(dirname(nuxiBin)), 'dist/chunks');
const files = [...new Set([httpxyEsm, httpxyCjs])];
for (const filename of await readdir(nuxiChunks)) {
  if (!filename.endsWith('.mjs')) continue;
  const file = join(nuxiChunks, filename);
  if ((await readFile(file, 'utf8')).includes('function _createProxyFn(type, server)')) files.push(file);
}
assert.equal(files.length, 3, 'Expected httpxy ESM/CJS plus the CLI bundled proxy; recheck the installed CLI layout');

const originalHandler = `    res.on("error", (error) => {
      _reject(error);
    });`;
const guardedHandler = `    res.on("error", (error) => {
      if (res.destroyed && (error.code === "ECONNABORTED" || error.code === "ECONNRESET" || error.code === "EPIPE")) {
        _resolve();
        return;
      }
      _reject(error);
    });`;

function factoryFrom(source) {
  const start = source.indexOf('function _createProxyFn(type, server)');
  const end = source.indexOf(source.includes('\nexport ') ? '\nexport ' : '\nexports.', start);
  assert(start >= 0 && end > start, 'Could not find the installed proxy factory');
  const context = vm.createContext({ URL });
  vm.runInContext(`${source.slice(start, end)}\nglobalThis.proxyFactory = _createProxyFn;`, context);
  return context.proxyFactory;
}

function request(factory, type, socket, upstreamError) {
  const passes = upstreamError ? [(_req, _res, _options, _server, _head, callback) => callback(upstreamError)] : [];
  const server = { options: {}, _wsPasses: passes, _webPasses: passes };
  const req = { socket, headers: {}, method: 'GET', url: '/' };
  // Attach fulfillment and rejection handlers before emitting a real socket error.
  return factory(type, server)(req, socket, { target: 'http://unused.invalid' })
    .then(() => ({ status: 'fulfilled' }), error => ({ status: 'rejected', error }));
}

async function exercise(factory) {
  const results = [];
  for (const type of ['ws', 'web']) {
    for (const code of ['ECONNABORTED', 'ECONNRESET', 'EPIPE']) {
      const socket = new Socket();
      const pending = request(factory, type, socket);
      // Node sets destroyed before emitting this native socket's error/close events.
      socket.destroy(Object.assign(new Error(`write ${code}`), { code }));
      const actual = await pending;
      results.push({ name: `${type}: destroyed downstream ${code}`, expected: 'fulfilled', actual: actual.status });
    }
    {
      const socket = new Socket();
      const pending = request(factory, type, socket);
      socket.destroy();
      results.push({ name: `${type}: ordinary close`, expected: 'fulfilled', actual: (await pending).status });
    }
    for (const [code, destroy] of [['ECONNABORTED', false], ['EIO', true]]) {
      const socket = new Socket();
      const error = Object.assign(new Error(code), { code });
      const pending = request(factory, type, socket);
      if (destroy) socket.destroy(error);
      else socket.emit('error', error);
      const actual = await pending;
      socket.destroy();
      assert.equal(actual.error, error, `Swallowed a live/unknown downstream error: ${code}`);
      results.push({ name: `${type}: propagate ${destroy ? 'unknown destroyed' : 'live'} downstream ${code}`, expected: 'rejected', actual: actual.status });
    }
    for (const code of ['ECONNABORTED', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND']) {
      const socket = new Socket();
      const error = Object.assign(new Error(`upstream ${code}`), { code });
      const actual = await request(factory, type, socket, error);
      socket.destroy();
      assert.equal(actual.error, error, `Swallowed a real upstream error: ${code}`);
      results.push({ name: `${type}: propagate upstream ${code}`, expected: 'rejected', actual: actual.status });
    }
  }
  return results;
}

const report = [];
for (const file of files) {
  const source = await readFile(file, 'utf8');
  const current = await exercise(factoryFrom(source));
  const failures = current.filter(result => result.actual !== result.expected);
  if (process.argv.includes('--compare')) {
    const candidate = source.includes(originalHandler) ? source.replace(originalHandler, guardedHandler) : source;
    const patched = await exercise(factoryFrom(candidate));
    assert.deepEqual(patched.filter(result => result.actual !== result.expected), []);
    report.push({ file, currentFailures: failures.map(result => result.name), candidatePassed: patched.length });
  } else {
    assert.deepEqual(failures, [], `${file}: ordinary downstream aborts still reject the proxy promise`);
    report.push({ file, installedChecksPassed: current.length });
  }
}
console.log(JSON.stringify(report, null, 2));
