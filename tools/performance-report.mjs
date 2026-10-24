import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

// Compare generated assets, not network timings affected by the local machine.
const root = resolve(process.argv[2] || '.output/public');
const output = process.argv[3];
const routes = ['/', '/book', '/sec', '/des', '/plan', '/link', '/about', '/book/content-theme', '/book/a-fun-guide-to-exploring-binaries', '/book/seven-languages-in-seven-weeks-bruce-a-tate'];
const bytes = async file => {
  const data = await readFile(file);
  return { raw: data.length, gzip: gzipSync(data).length };
};
const total = items => items.reduce((sum, item) => ({ raw: sum.raw + item.raw, gzip: sum.gzip + item.gzip }), { raw: 0, gzip: 0 });
const files = await readdir(join(root, '_nuxt'));
const bundles = {};
for (const extension of ['js', 'css']) {
  const assets = await Promise.all(files.filter(name => name.endsWith(`.${extension}`)).map(async name => ({ name, ...await bytes(join(root, '_nuxt', name)) })));
  bundles[extension] = { count: assets.length, ...total(assets), largest: assets.sort((a, b) => b.raw - a.raw).slice(0, 5) };
}
const pages = {};
for (const route of routes) {
  const directory = join(root, route.slice(1));
  const html = await readFile(join(directory, 'index.html'), 'utf8');
  const assets = new Set();
  for (const tag of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    if (tag[0].startsWith('<link') && !/rel="(?:modulepreload|stylesheet)"/.test(tag[0])) continue;
    const url = tag[0].match(/(?:src|href)="(\/_nuxt\/[^"?#]+)[^"]*"/);
    if (url) assets.add(url[1].slice(1));
  }
  const referenced = await Promise.all([...assets].map(async name => ({ name, ...await bytes(join(root, name)) })));
  const payload = join(directory, '_payload.json');
  pages[route] = {
    html: Buffer.byteLength(html),
    payload: await stat(payload).then(() => bytes(payload)).catch(() => ({ raw: 0, gzip: 0 })),
    referencedJs: total(referenced.filter(file => file.name.endsWith('.js'))),
    referencedCss: total(referenced.filter(file => file.name.endsWith('.css'))),
    assetCount: referenced.length,
    flowNodes: (html.match(/data-flow-node=/g) || []).length,
    articleSections: (html.match(/\bclass="[^"]*\barticle-section\b/g) || []).length,
  };
}
const report = { directory: relative(process.cwd(), root), bundles, pages };
const json = JSON.stringify(report, null, 2);
if (output) await writeFile(resolve(output), `${json}\n`);
console.log(json);
