// Content 2.12 and MDC 0.6 inject bare dependency names into Vite's include
// list. Resolve those existing entries from their actual owner under pnpm.
const contentDependencies = new Set(['slugify']);
const mdcDependencies = new Set([
  'remark-gfm', 'remark-emoji', 'remark-mdc', 'remark-rehype', 'rehype-raw',
  'parse5', 'unist-util-visit', 'unified', 'debug',
]);

export function prepareDevDependencyIncludes(includes: readonly string[] = []): string[] {
  const resolved = includes.map((id) => {
    if (contentDependencies.has(id)) return `@nuxt/content > ${id}`;
    if (mdcDependencies.has(id)) return `@nuxt/content > @nuxtjs/mdc > ${id}`;
    return id;
  });
  // These are loaded by the graph, gallery and QR widget. Pre-bundle before
  // visiting them so their first use does not trigger another optimizer reload.
  return [...new Set([...resolved, 'd3', 'three', 'qrcode'])];
}
