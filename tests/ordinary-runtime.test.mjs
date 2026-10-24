import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fetchGithubJson } from '../utils/github-data.ts';
import { preloadImages } from '../utils/preload-images.ts';
import { parseStringList, readStoredValue, removeStoredValue, writeStoredValue } from '../utils/browser-storage.ts';

const response = (data) => ({ ok: true, json: async () => data });

test('GitHub requests share results and isolate cancellation', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  await t.test('one subscriber leaving does not abort another subscriber', async () => {
    let calls = 0;
    let resolveFetch;
    let requestSignal;
    globalThis.fetch = (_, options) => {
      calls++;
      requestSignal = options.signal;
      return new Promise((resolve) => { resolveFetch = resolve; });
    };
    const firstController = new AbortController();
    const secondController = new AbortController();
    const first = fetchGithubJson('https://api.github.com/test/shared', firstController.signal);
    const second = fetchGithubJson('https://api.github.com/test/shared', secondController.signal);
    const rejected = assert.rejects(first, { name: 'AbortError' });
    firstController.abort();
    await rejected;
    assert.equal(requestSignal.aborted, false);
    resolveFetch(response({ name: 'shared' }));
    assert.deepEqual(await second, { name: 'shared' });
    assert.deepEqual(await fetchGithubJson('https://api.github.com/test/shared', new AbortController().signal), { name: 'shared' });
    assert.equal(calls, 1);
  });

  await t.test('the last subscriber cancels the request and a later visit retries', async () => {
    let signal;
    globalThis.fetch = (_, options) => {
      signal = options.signal;
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    };
    const controller = new AbortController();
    const pending = fetchGithubJson('https://api.github.com/test/cancel', controller.signal);
    const rejected = assert.rejects(pending, { name: 'AbortError' });
    controller.abort();
    await rejected;
    assert.equal(signal.aborted, true);
    globalThis.fetch = async () => response({ retried: true });
    assert.deepEqual(await fetchGithubJson('https://api.github.com/test/cancel', new AbortController().signal), { retried: true });
  });

  await t.test('HTTP and JSON failures are not cached', async () => {
    globalThis.fetch = async () => ({ ok: false, status: 429 });
    await assert.rejects(fetchGithubJson('https://api.github.com/test/http', new AbortController().signal), /429/);
    globalThis.fetch = async () => response('recovered');
    assert.equal(await fetchGithubJson('https://api.github.com/test/http', new AbortController().signal), 'recovered');

    globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('invalid JSON'); } });
    await assert.rejects(fetchGithubJson('https://api.github.com/test/json', new AbortController().signal), SyntaxError);
    globalThis.fetch = async () => response('recovered');
    assert.equal(await fetchGithubJson('https://api.github.com/test/json', new AbortController().signal), 'recovered');
  });

  await t.test('successful cached data expires after five minutes', async () => {
    const originalNow = Date.now;
    let now = originalNow();
    let calls = 0;
    Date.now = () => now;
    globalThis.fetch = async () => response(++calls);
    try {
      assert.equal(await fetchGithubJson('https://api.github.com/test/ttl', new AbortController().signal), 1);
      now += 5 * 60 * 1000 - 1;
      assert.equal(await fetchGithubJson('https://api.github.com/test/ttl', new AbortController().signal), 1);
      now += 2;
      assert.equal(await fetchGithubJson('https://api.github.com/test/ttl', new AbortController().signal), 2);
    } finally {
      Date.now = originalNow;
    }
  });
});

test('image preload settles cached, failed, empty, and cancelled batches', (t) => {
  const originalImage = globalThis.Image;
  const images = [];
  globalThis.Image = class {
    complete = false;
    constructor() { images.push(this); }
    set src(value) {
      assert.equal(typeof this.onload, 'function');
      assert.equal(typeof this.onerror, 'function');
      this.complete = value === 'cached';
    }
  };
  t.after(() => { globalThis.Image = originalImage; });

  let completed = 0;
  preloadImages([], () => completed++);
  assert.equal(completed, 1);
  preloadImages(['cached'], () => completed++);
  assert.equal(completed, 2);
  preloadImages(['first', 'first', 'failed'], () => completed++);
  assert.equal(images.length, 3);
  images[1].onload();
  assert.equal(completed, 2);
  images[2].onerror();
  assert.equal(completed, 3);
  assert.equal(images[1].onload, null);
  assert.equal(images[2].onerror, null);

  const stop = preloadImages(['cancelled'], () => completed++);
  const staleLoad = images[3].onload;
  stop();
  staleLoad();
  assert.equal(images[3].onload, null);
  assert.equal(completed, 3);
});

test('blocked browser storage and malformed calorie history do not crash the page', (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new DOMException('blocked', 'SecurityError'); },
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  });
  assert.equal(readStoredValue('history'), null);
  assert.equal(writeStoredValue('history', '[]'), false);
  assert.equal(removeStoredValue('history'), false);
  assert.deepEqual(parseStringList('{broken'), []);
  assert.deepEqual(parseStringList('{"value": 1}'), []);
  assert.deepEqual(parseStringList('["valid", null, 42, "another"]'), ['valid', 'another']);
});

test('text shuffle preserves its cadence and releases its only timer on unmount', () => {
  const source = readFileSync(new URL('../components/anFont.vue', import.meta.url), 'utf8');
  const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1]
    .replace(/import\s*\{[^}]+\}\s*from\s*"vue";/, '');
  const props = { text: ['abc', 'def'] };
  const timers = new Map();
  let nextId = 0;
  let mounted;
  let unmounted;
  let changed;
  const setup = new Function('ref', 'defineProps', 'onMounted', 'onBeforeUnmount', 'watch', 'setTimeout', 'clearTimeout', `${script}\nreturn scrambledText;`);
  const text = setup(
    (value) => ({ value }), () => props,
    (callback) => { mounted = callback; }, (callback) => { unmounted = callback; },
    (_, callback) => { changed = callback; },
    (callback, delay) => { const id = ++nextId; timers.set(id, { callback, delay }); return id; },
    (id) => timers.delete(id),
  );
  const runTimer = (delay) => {
    assert.equal(timers.size, 1);
    const [id, timer] = timers.entries().next().value;
    assert.equal(timer.delay, delay);
    timers.delete(id);
    timer.callback();
  };
  assert.equal(text.value, 'abc');
  mounted();
  runTimer(0);
  runTimer(100);
  runTimer(100);
  assert.equal(text.value, 'abc');
  runTimer(2000);
  props.text = [];
  changed();
  assert.equal(timers.size, 0);
  props.text = ['abc'];
  changed();
  assert.equal(timers.size, 1);
  const staleCallback = timers.values().next().value.callback;
  unmounted();
  assert.equal(timers.size, 0);
  staleCallback();
  assert.equal(timers.size, 0);
});
