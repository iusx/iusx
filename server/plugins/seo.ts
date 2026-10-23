import { canonicalUrl, documentSeo } from '../../utils/seo';

export default defineNitroPlugin(nitroApp => {
  // Content's built-in path transformer runs after custom transformers.
  // This hook receives the final path and draft/partial flags.
  nitroApp.hooks.hook('content:file:afterParse', content => {
    if (!content._path) return;
    const seo = documentSeo(content, content._path);
    if (seo.noindex || content._draft || content._partial || content.sitemap === false) {
      content.sitemap = false;
    } else {
      content.sitemap = {
        ...(content.sitemap && typeof content.sitemap === 'object' ? content.sitemap : {}),
        loc: canonicalUrl(content._path),
        ...(seo.modifiedTime ? { lastmod: seo.modifiedTime } : {}),
      };
    }
  });
});
