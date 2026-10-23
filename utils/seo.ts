export const SITE_SEO = {
  name: 'ritsu',
  url: 'https://m.ritsu.jiangxue.org',
  description: 'Computer networking, Security, and Design Enthusiast.',
  image: '/logo.png',
  language: 'zh-CN',
};

export interface SeoPage {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  noindex?: boolean;
  robots?: string;
  language?: string;
}

type Data = Record<string, unknown>;
const record = (value: unknown): Data => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Data : {};
const string = (value: unknown): string => typeof value === 'string' ? value.trim() : '';
const firstText = (...values: unknown[]): string => values.map(string).find(Boolean) || '';

/** Keep canonical links on this site's origin, without tracking parameters. */
export function canonicalUrl(path: string): string {
  let pathname = '/';
  try {
    pathname = new URL(string(path) || '/', `${SITE_SEO.url}/`).pathname;
  } catch {
    pathname = string(path).split(/[?#]/, 1)[0] || '/';
  }
  pathname = `/${pathname.replace(/^\/+/, '')}`.replace(/\/+$/, '') || '/';
  return `${SITE_SEO.url}${pathname}`;
}

/** Match the image roots used by book-content and the ordinary article layout. */
export function resolveSeoImage(image: unknown, path: string): string {
  const fallback = `${SITE_SEO.url}${SITE_SEO.image}`;
  if (Array.isArray(image)) return resolveSeoImage(image[0], path);
  if (image && typeof image === 'object') {
    const data = record(image);
    return resolveSeoImage(data.url || data.src, path);
  }
  const candidate = string(image).split(',')[0]?.trim() || '';
  if (!candidate || /[\u0000-\u001f\u007f\\]/.test(candidate)) return fallback;
  if (/^https?:\/\//i.test(candidate)) {
    try {
      const url = new URL(candidate);
      return url.hostname && !url.username && !url.password ? candidate : fallback;
    } catch { return fallback; }
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(candidate) || candidate.startsWith('//')) return fallback;
  const relative = candidate.replace(/^(?:\.\/)+/, '');
  if (relative.split(/[/?#]/).some(part => part === '..')) return fallback;
  const imagePath = relative.startsWith('/') ? relative : `${/^\/book(?:\/|$)/.test(new URL(canonicalUrl(path)).pathname) ? '/img/book/' : '/img/'}${relative}`;
  return new URL(imagePath, SITE_SEO.url).href;
}

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function plainText(value: unknown): string {
  return string(value)
    .replace(/<(script|style|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`+[^`]*`+/g, ' ')
    .replace(/(^|\s)[#>*]+\s/g, '$1')
    .replace(/(\*\*|__|~~)/g, '')
    .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code: string) => {
      if (!code.startsWith('#')) return entities[code.toLowerCase()] ?? match;
      const number = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : ' ';
    })
    .replace(/[\u0000-\u001f\u007f\s]+/g, ' ')
    .trim();
}

function shortDescription(value: unknown): string {
  const characters = Array.from(plainText(value));
  if (characters.length <= 160) return characters.join('');
  return `${characters.slice(0, 157).join('').trimEnd()}…`;
}

const skippedTags = /^(?:pre|code|script|style|html|iframe|object|embed|svg|math|json|text-flow|flow|flowchart|mermaid|text-title|h[1-6])$/i;
const inlineTags = new Set(['a', 'strong', 'b', 'em', 'i', 'del', 's', 'u', 'span', 'sub', 'sup', 'small', 'mark', 'abbr', 'cite', 'q']);
function children(node: Data): Data[] {
  return Array.isArray(node.children) ? node.children.map(record) : [];
}
function readableNode(node: Data): boolean {
  return !['html', 'code', 'inlineCode', 'comment', 'json'].includes(string(node.type))
    && !skippedTags.test(string(node.tag)) && !/(?:^|-)(?:flow|json)(?:-|$)/i.test(string(node.tag));
}
function inlineText(node: Data): string {
  if (!readableNode(node)) return '';
  if (node.type === 'text') return typeof node.value === 'string' ? node.value : ''; 
  if (node.tag === 'br') return ' ';
  if (!inlineTags.has(string(node.tag))) return '';
  return children(node).map(inlineText).join('');
}
function bodySummary(document: Data): string {
  let summary = '';
  let paragraph = '';
  const visit = (node: Data) => {
    if (!readableNode(node)) return;
    if (!summary && node.tag === 'text-sum') {
      const props = record(node.props);
      const reference = string(props[':desc']);
      // MDC bindings are field references, never expressions to evaluate.
      const bound = /^[\w-]+$/.test(reference) ? document[reference] : undefined;
      summary = shortDescription(firstText(props.desc, bound));
    }
    if (!paragraph && (node.tag === 'p' || node.type === 'paragraph')) {
      paragraph = shortDescription(children(node).map(inlineText).join(''));
    }
    for (const child of children(node)) visit(child);
  };
  visit(record(document.body));
  return summary || paragraph;
}

/** Reject partial years and invalid calendar dates instead of inventing dates. */
export function parseSeoDate(value: unknown): string | undefined {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.toISOString() : undefined;
  const input = string(value);
  const date = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(.*)$/.exec(input);
  if (!date) return undefined;
  const [, yearText, monthText, dayText, tail] = date;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  if (year < 1000 || month < 1 || month > 12 || day < 1) return undefined;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > days[month - 1]!) return undefined;
  let time = 'T00:00:00Z';
  if (tail) {
    const match = /^(?:T| )(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/.exec(tail);
    if (!match) return undefined;
    const [, hours, minutes, seconds = '00', fraction = '', zone = 'Z'] = match;
    if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59) return undefined;
    if (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4, 6)) > 59)) return undefined;
    time = `T${hours}:${minutes}:${seconds}${fraction}${zone}`;
  }
  const normalized = `${yearText}-${monthText!.padStart(2, '0')}-${dayText!.padStart(2, '0')}${time}`;
  const timestamp = new Date(normalized);
  return Number.isFinite(timestamp.getTime()) ? timestamp.toISOString() : undefined;
}

function metaValue(head: Data, ...keys: string[]): string {
  if (!Array.isArray(head.meta)) return '';
  for (const key of keys) {
    const entry = head.meta.map(record).find(meta => firstText(meta.name, meta.property).toLowerCase() === key);
    if (entry && string(entry.content)) return string(entry.content);
  }
  return '';
}
function robotsText(value: unknown): string {
  if (Array.isArray(value)) return value.map(robotsText).filter(Boolean).join(', ');
  if (value && typeof value === 'object') {
    const options = record(value);
    return [
      options.noindex === true || options.index === false ? 'noindex' : options.index === true ? 'index' : '',
      options.nofollow === true || options.follow === false ? 'nofollow' : options.follow === true ? 'follow' : '',
    ].filter(Boolean).join(', ');
  }
  return string(value);
}
const sectionNames: Record<string, string> = { book: '阅读笔记', des: '视觉设计', sec: '安全研究', plan: '项目与计划', link: '友情链接' };
function restrictsIndexing(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(restrictsIndexing);
  if (value && typeof value === 'object') {
    const options = record(value);
    return options.index === false || options.noindex === true;
  }
  return /(?:^|[\s,;])(?:noindex|none)(?:$|[\s,;])/i.test(string(value));
}

/** Derive article metadata without rewriting frontmatter or the Markdown AST. */
export function documentSeo(document: Record<string, unknown>, path: string): SeoPage {
  const seo = record(document.seo);
  const head = record(document.head);
  const pathname = new URL(canonicalUrl(path)).pathname;
  const category = pathname.split('/')[1] || '';
  const section = firstText(seo.section, document.section, sectionNames[category]);
  const title = plainText(firstText(seo.title, head.title, metaValue(head, 'og:title', 'twitter:title'), document.title, document.name)) || (pathname === '/' ? SITE_SEO.name : section || SITE_SEO.name);
  const fallback = pathname === '/' ? SITE_SEO.description : `${title}，ritsu 的${section || '文章与创作记录'}。`;
  const bodyDescription = bodySummary(document);
  const description = shortDescription(firstText(seo.description, head.description, metaValue(head, 'description', 'og:description', 'twitter:description'), document.description)) || bodyDescription || fallback;
  const image = seo.image || metaValue(head, 'og:image', 'twitter:image') || head.image || record(document.ogImage).url || document.image || document.cover || document.img;
  const authorRecord = record(document.author);
  const author = plainText(firstText(seo.author, typeof document.author === 'string' ? document.author : authorRecord.name, metaValue(head, 'author'), document.by, category !== 'book' ? document.director : undefined)) || SITE_SEO.name;
  const publishedTime = [seo.publishedTime, document.date, document.publishedAt, document.release_date, document.time].map(parseSeoDate).find(Boolean);
  const modifiedTime = [seo.modifiedTime, document.modifiedAt, document.updatedAt, document.updated, document.dateModified].map(parseSeoDate).find(Boolean);
  const explicitRobots = firstText(robotsText(seo.robots), metaValue(head, 'robots'), robotsText(document.robots));
  const noindex = seo.noindex === true || document.noindex === true || document.index === false || document.indexable === false || [seo.robots, document.robots, metaValue(head, 'robots')].some(restrictsIndexing)
    || (['des', 'link'].includes(category) && !bodyDescription);
  const robots = noindex && explicitRobots && !restrictsIndexing(explicitRobots)
    ? `noindex, ${explicitRobots.replace(/(?:^|[\s,;])index(?=$|[\s,;])/gi, '').replace(/^[\s,;]+/, '')}`.replace(/[\s,;]+$/, '')
    : explicitRobots;
  return {
    title,
    description,
    image: resolveSeoImage(image, path),
    imageAlt: plainText(firstText(seo.imageAlt, record(document.ogImage).alt, record(image).alt, document.imageAlt, title)),
    type: seo.type === 'website' || pathname === '/' ? 'website' : 'article',
    author,
    ...(publishedTime ? { publishedTime } : {}),
    ...(modifiedTime ? { modifiedTime } : {}),
    ...(section ? { section } : {}),
    noindex,
    ...(robots ? { robots } : {}),
    language: firstText(seo.language, seo.lang, document.language, document.lang) || SITE_SEO.language,
  };
}

/** Safe to place in a JSON-LD script even when content contains HTML. */
export function serializeSeoSchema(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
