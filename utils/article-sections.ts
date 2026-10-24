import type { MarkdownNode } from "@nuxt/content/types";

type Size = { elements: number; characters: number; lines: number };
const emptySize = (): Size => ({ elements: 0, characters: 0, lines: 0 });
const addSize = (total: Size, size: Size) => {
  total.elements += size.elements;
  total.characters += size.characters;
  total.lines += size.lines;
};
const isHeading = (node: MarkdownNode) => node.tag === "text-title" || /^h[1-6]$/.test(node.tag || "");
const isWhitespace = (node: MarkdownNode) => node.type === "comment" || (node.type === "text" && !node.value?.trim());
const isLegacyPair = (first: MarkdownNode, second: MarkdownNode) =>
  (first.tag === "text-title" && second.props?.["data-toc-marker"] !== undefined)
  || (second.tag === "text-title" && first.props?.["data-toc-marker"] !== undefined);

function documentKey(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Add hydration boundaries only to large book articles. All original nodes stay
 * in their original order and are rendered on the server; sections never split
 * the inside of a paragraph, code block, table, or interactive MDC component.
 */
export function groupLongBookSections(root: MarkdownNode, documentId: string): void {
  const sizes = new WeakMap<MarkdownNode, Size>();
  const books: MarkdownNode[] = [];
  const usedIds = new Set<string>();

  // Collect subtree sizes, book containers and existing IDs in one traversal.
  const measure = (node: MarkdownNode): Size => {
    const size = emptySize();
    if (node.type === "element") size.elements = 1;
    if (node.type === "text") {
      size.characters = node.value?.length || 0;
      size.lines = node.value?.match(/\n/g)?.length || 0;
    }
    if (typeof node.props?.id === "string") usedIds.add(node.props.id);
    if (node.tag === "book-content") books.push(node);
    for (const child of node.children || []) addSize(size, measure(child));
    sizes.set(node, size);
    return size;
  };
  measure(root);

  const prefix = `article-section-${documentKey(documentId)}`;
  books.forEach((book, bookIndex) => {
    const children = book.children || [];
    const total = sizes.get(book)!;
    if ((total.elements < 3000 && total.characters < 30000)
      || children.some(node => node.tag === "lazy-article-section")) return;

    const groups: MarkdownNode[][] = [];
    let group: MarkdownNode[] = [];
    let size = emptySize();
    let hasBody = false;
    const flush = () => {
      if (group.length) groups.push(group);
      group = [];
      size = emptySize();
      hasBody = false;
    };

    for (let index = 0; index < children.length;) {
      const start = index++;
      const first = children[start];
      if (isHeading(first)) {
        let next = index;
        while (next < children.length && isWhitespace(children[next])) next++;
        if (next < children.length && isLegacyPair(first, children[next])) index = next + 1;
      }
      // Keep formatting whitespace with the preceding block and heading pair.
      while (index < children.length && isWhitespace(children[index])) index++;
      if (isHeading(first) && index < children.length && !isHeading(children[index])) {
        index++;
        while (index < children.length && isWhitespace(children[index])) index++;
      }
      const atom = children.slice(start, index);
      const atomSize = emptySize();
      for (const node of atom) addSize(atomSize, sizes.get(node)!);

      const startsHeading = isHeading(first);
      const exceedsBudget = size.elements + atomSize.elements > 350 || size.characters + atomSize.characters > 4000;
      const chapterBoundary = startsHeading && (size.elements >= 140 || size.characters >= 1600);
      // A heading stays with its first body block, even if that block is large.
      // Oversized individual components are kept whole rather than fragmented.
      if (hasBody && (exceedsBudget || chapterBoundary)) flush();
      group.push(...atom);
      addSize(size, atomSize);
      if (atom.some(node => !isHeading(node) && !isWhitespace(node))) hasBody = true;
    }
    flush();
    if (groups.length < 2) return;

    book.children = groups.map((nodes, sectionIndex) => {
      const baseId = `${prefix}-${bookIndex}-${sectionIndex}`;
      let id = baseId;
      let suffix = 1;
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      usedIds.add(id);
      const sectionSize = emptySize();
      for (const node of nodes) addSize(sectionSize, sizes.get(node)!);
      const estimatedHeight = Math.round(Math.max(240, Math.min(12000,
        (sectionSize.characters / 70 + sectionSize.lines) * 28 + nodes.length * 24)));
      return {
        type: "element",
        tag: "lazy-article-section",
        props: {
          id,
          ...(sectionIndex === 0 ? { eager: true } : {}),
          "estimated-height": estimatedHeight,
        },
        children: nodes,
      };
    });
  });
}
