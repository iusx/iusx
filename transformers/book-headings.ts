import { defineTransformer } from "@nuxt/content/transformers";
import type { MarkdownNode } from "@nuxt/content/types";
import { groupLongBookSections } from "../utils/article-sections";
import { wrapNativeSvgNodes } from "../utils/native-svg";

const textContent = (node: MarkdownNode): string =>
  node.type === "text" ? node.value || "" : (node.children || []).map(textContent).join("");

function markLegacyHeadings(nodes: MarkdownNode[]) {
  const siblings = nodes.filter(node => node.type !== "text" || node.value?.trim());
  siblings.forEach((node, index) => {
    if (/^h[1-6]$/.test(node.tag || "")) {
      const count = textContent(node).trim().match(/\s+(\d)$/);
      const adjacentTitle = [siblings[index - 1], siblings[index + 1]]
        .some(sibling => sibling?.tag === "text-title");
      // Older posts pair a hidden Markdown heading/count with a visible text-title.
      // Only those pairs are markers; ordinary headings such as “Vue 3” stay intact.
      if (count && adjacentTitle) {
        node.props = { ...node.props, "data-toc-marker": "true", "data-toc-count": count[1], "aria-hidden": "true" };
      }
    }
    if (node.children) markLegacyHeadings(node.children);
  });
}

export default defineTransformer({
  name: "book-headings",
  extensions: [".md"],
  transform(content) {
    if (/^\w+:book:/.test(content._id) && content.body) {
      markLegacyHeadings(content.body.children);
      groupLongBookSections(content.body, content._id);
    }
    if (content.body?.children) wrapNativeSvgNodes(content.body);
    return content;
  },
});
