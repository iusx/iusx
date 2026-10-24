import { Comment, h, Text } from "vue";
import type { VNode } from "vue";
import type { MarkdownNode } from "@nuxt/content/types";

const nativeTags = new Set(("svg mjx-container a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform "
  + "circle clipPath color-profile cursor defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite "
  + "feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB "
  + "feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight "
  + "feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name "
  + "font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask "
  + "metadata missing-glyph mpath path pattern polygon polyline radialGradient rect set stop style switch "
  + "symbol text textPath title tref tspan use view vkern").split(" "));

function isStaticNativeTree(node: MarkdownNode): boolean {
  if (node.type === "text" || node.type === "comment") return true;
  return node.type === "element" && nativeTags.has(node.tag || "")
    && !Object.keys(node.props || {}).some(key => /^[:@]|^v-/.test(key))
    && (node.children || []).every(isStaticNativeTree);
}

function isMathJaxStylesheet(node: MarkdownNode): boolean {
  return node.tag === "style" && Object.values(node.props || {}).every(value => value == null)
    && Boolean(node.children?.length) && node.children!.every(child => child.type === "text")
    && /^\s*mjx-container\[jax="SVG"\]\s*\{/.test(node.children!.map(child => child.value || "").join(""));
}

/** Keep MDC's component resolver out of native SVG descendants such as g/use. */
export function wrapNativeSvgNodes(root: MarkdownNode): void {
  const visit = (node: MarkdownNode): MarkdownNode => {
    if (((node.tag === "svg" || node.tag === "mjx-container") && isStaticNativeTree(node))
      || isMathJaxStylesheet(node)) {
      return { type: "element", tag: "native-svg", props: { tree: node }, children: [] };
    }
    if (node.children) node.children = node.children.map(visit);
    return node;
  };
  if (root.children) root.children = root.children.map(visit);
}

// HAST stores namespace/data/ARIA attributes as property names. Match their
// original serialized names while preserving case-sensitive SVG attributes.
const attributeAliases: Record<string, string> = {
  className: "class", tabIndex: "tabindex", xmlnsXLink: "xmlns:xlink",
  xmlBase: "xml:base", xmlLang: "xml:lang", xmlSpace: "xml:space",
};
export function nativeSvgAttributes(props: Record<string, unknown> = {}) {
  const attributes: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === "__ignoreMap") continue;
    const attribute = attributeAliases[key]
      || (/^xLink[A-Z]/.test(key) ? `xlink:${key.slice(5).toLowerCase()}` : undefined)
      || (/^(?:data|aria)[A-Z]/.test(key) ? key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`) : key);
    attributes[attribute] = Array.isArray(value) && value.every(item => typeof item === "string")
      ? value.join(" ") : value;
  }
  return attributes;
}

export function renderNativeSvg(node: MarkdownNode): VNode {
  if (node.type === "text") return h(Text, node.value || "");
  if (node.type === "comment") return h(Comment, node.value || "");
  if (isMathJaxStylesheet(node)) {
    // HTML style elements are raw-text elements: character references such as
    // &quot; are not decoded there. Only the generated MathJax stylesheet uses
    // raw CSS; escape a closing style tag as CSS without changing its value.
    const css = node.children!.map(child => child.value || "").join("")
      .replace(/<\/style/gi, closingTag => closingTag.replace("/", "\\/"));
    return h("style", { innerHTML: css });
  }
  return h(node.tag || "g", nativeSvgAttributes(node.props), (node.children || []).map(renderNativeSvg));
}
