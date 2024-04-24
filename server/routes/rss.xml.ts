import { serverQueryContent } from "#content/server";
// @ts-ignore
import RSS from "rss";

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: "RHYME.Q 韵清",
    site_url: "https://member.rhyme.jiangxue.org/",
    feed_url: `https://member.rhyme.jiangxue.org/rss.xml`,
  });

  const docs = await serverQueryContent(event)
    .sort({ date: -1 })
    .where({ _partial: false })
    .find();

  const blogPosts = docs.filter(
    (doc) => doc?._path?.includes("/dev")
  );
  for (const doc of blogPosts) {
    feed.item({
      title: doc.title ?? "-",
      url: `member.rhyme.jiangxue.org${doc._path}`,
      date: doc.release_date,
      description: doc.description,
    });
  }

  const feedString = feed.xml({ indent: true });
  event.res.setHeader("content-type", "text/xml");
  event.res.end(feedString);
});