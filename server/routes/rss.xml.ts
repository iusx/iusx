import { serverQueryContent } from "#content/server";
// @ts-ignore
import RSS from "rss";

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: "ritsu りつ",
    site_url: "https://member.ritsu.jiangxue.org/",
    feed_url: `https://member.ritsu.jiangxue.org/rss.xml`,
  });

  const docs = await serverQueryContent(event)
    .sort({ date: -1 })
    .where({ _partial: false })
    .find();

  const blogPosts = docs.filter(
    (doc) =>
      doc?._path?.includes("/sec") ||
      doc?._path?.includes("/book") ||
      doc?._path?.includes("/des"),
  );
  for (const doc of blogPosts) {
    feed.item({
      title: doc.title ?? "-",
      url: `member.ritsu.jiangxue.org${doc._path}`,
      date: doc.release_date,
      description: doc.description,
    });
  }

  const feedString = feed.xml({ indent: true });
  event.res.setHeader("content-type", "text/xml");
  event.res.end(feedString);
});

