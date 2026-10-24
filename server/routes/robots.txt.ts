import { SITE_SEO } from '../../utils/seo';

export default defineEventHandler(event => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  // Keep noindex pages crawlable so search engines can read their robots meta.
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_SEO.url}/sitemap.xml\n`;
});
