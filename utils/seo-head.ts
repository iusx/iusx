import { canonicalUrl, resolveSeoImage, serializeSeoSchema, SITE_SEO } from './seo';
import type { SeoPage } from './seo';

const sectionLabels: Record<string, string> = {
  book: '书架与阅读笔记', des: '视觉设计作品集', sec: '安全研究与漏洞报告',
  plan: '学习计划与项目进度', link: '友情链接',
};
const tags = (value: unknown): Record<string, unknown>[] => Array.isArray(value)
  ? value.filter((tag): tag is Record<string, unknown> => !!tag && typeof tag === 'object' && !Array.isArray(tag)) : [];

/** One head entry keeps search, social cards and structured data in sync. */
export function buildSeoHead(page: SeoPage, path: string, extra: Record<string, unknown> = {}) {
  const url = canonicalUrl(path);
  const title = page.title.trim() || SITE_SEO.name;
  const fullTitle = title === SITE_SEO.name || title.startsWith(`${SITE_SEO.name} | `) || title.endsWith(` - ${SITE_SEO.name}`)
    ? title : `${title} - ${SITE_SEO.name}`;
  const image = resolveSeoImage(page.image, path);
  const language = page.language || SITE_SEO.language;
  const author = page.author || SITE_SEO.name;
  const type = page.type || 'website';
  const meta: { name?: string; property?: string; content: string }[] = [
    { name: 'description', content: page.description },
    { name: 'author', content: author },
    { name: 'robots', content: page.robots || (page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large') },
    { property: 'og:site_name', content: SITE_SEO.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: page.description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: language.replace(/-/g, '_') },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: page.imageAlt || title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: page.description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: page.imageAlt || title },
    ...(type === 'article' ? [
      ...(page.publishedTime ? [{ property: 'article:published_time', content: page.publishedTime }] : []),
      ...(page.modifiedTime ? [{ property: 'article:modified_time', content: page.modifiedTime }] : []),
      ...(page.section ? [{ property: 'article:section', content: page.section }] : []),
      { property: 'article:author', content: author },
    ] : []),
  ];
  const breadcrumbs = [{ name: '首页', item: canonicalUrl('/') }];
  const pathname = new URL(url).pathname;
  const section = pathname.split('/')[1] || '';
  if (pathname !== '/') {
    if (sectionLabels[section] && pathname !== `/${section}`) {
      breadcrumbs.push({ name: sectionLabels[section]!, item: canonicalUrl(`/${section}`) });
    }
    breadcrumbs.push({ name: title, item: url });
  }
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${SITE_SEO.url}/#person`, name: SITE_SEO.name, url: canonicalUrl('/') },
      {
        '@type': 'WebSite', '@id': `${SITE_SEO.url}/#website`, name: SITE_SEO.name,
        url: canonicalUrl('/'), description: SITE_SEO.description, inLanguage: SITE_SEO.language,
        publisher: { '@id': `${SITE_SEO.url}/#person` },
      },
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url, name: fullTitle,
        description: page.description, inLanguage: language, primaryImageOfPage: { '@type': 'ImageObject', url: image },
        isPartOf: { '@id': `${SITE_SEO.url}/#website` }, breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })),
      },
      ...(type === 'article' ? [{
        '@type': 'BlogPosting', '@id': `${url}#article`, headline: title, description: page.description,
        image: [image], author: { '@type': 'Person', name: author },
        publisher: { '@id': `${SITE_SEO.url}/#person` }, mainEntityOfPage: { '@id': `${url}#webpage` },
        inLanguage: language,
        ...(page.section ? { articleSection: page.section } : {}),
        ...(page.publishedTime ? { datePublished: page.publishedTime } : {}),
        ...(page.modifiedTime ? { dateModified: page.modifiedTime } : {}),
      }] : []),
    ],
  };
  const generatedMeta = new Set(meta.map(tag => (tag.name || tag.property)?.toLowerCase()));
  return {
    ...extra,
    title: fullTitle,
    titleTemplate: null,
    htmlAttrs: { ...(extra.htmlAttrs && typeof extra.htmlAttrs === 'object' ? extra.htmlAttrs : {}), lang: language },
    meta: [
      ...tags(extra.meta).filter(tag => !generatedMeta.has(String(tag.name || tag.property || '').toLowerCase())),
      ...meta,
    ],
    link: [
      ...tags(extra.link).filter(tag => tag.rel !== 'canonical' && !(tag.rel === 'alternate' && tag.type === 'application/rss+xml')),
      { key: 'canonical', rel: 'canonical', href: url },
      { key: 'rss', rel: 'alternate', type: 'application/rss+xml', title: `${SITE_SEO.name} RSS`, href: `${SITE_SEO.url}/rss.xml` },
    ],
    script: [
      ...tags(extra.script).filter(tag => tag.key !== 'page-seo-schema'),
      { key: 'page-seo-schema', type: 'application/ld+json', innerHTML: serializeSeoSchema(schema) },
    ],
  };
}
