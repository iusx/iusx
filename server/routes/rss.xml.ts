import { serverQueryContent } from "#content/server";
// @ts-ignore
import RSS from "rss";
import { canonicalUrl, documentSeo, SITE_SEO } from "../../utils/seo";

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: SITE_SEO.name,
    description: SITE_SEO.description,
    site_url: canonicalUrl("/"),
    feed_url: `${SITE_SEO.url}/rss.xml`,
  });

  const docs = await serverQueryContent(event)
    .where({ _partial: false })
    .find();

  const blogPosts = docs
    .filter(doc => doc._path && /^\/(sec|book|des|plan)\//.test(doc._path) && !doc._draft)
    .map(doc => ({ doc, seo: documentSeo(doc, doc._path!) }))
    .filter(({ seo }) => !seo.noindex)
    .sort((a, b) => (Date.parse(b.seo.publishedTime || "") || 0) - (Date.parse(a.seo.publishedTime || "") || 0));
  for (const { doc, seo } of blogPosts) {
    feed.item({
      title: seo.title,
      url: canonicalUrl(doc._path!),
      ...(seo.publishedTime ? { date: seo.publishedTime } : {}),
      description: seo.description,
      author: seo.author,
    });
  }

  const feedString = feed.xml({ indent: true });
  event.res.setHeader("content-type", "text/xml");
  event.res.end(feedString);
});

