# 自动 SEO

全站默认信息在 `utils/seo.ts` 的 `SITE_SEO` 中维护，独立页面文案在 `utils/seo-pages.ts` 中维护。首页沿用原简介：`Computer networking, Security, and Design Enthusiast.`。

所有页面都会输出标题、描述、canonical、Open Graph、Twitter Card 和 JSON-LD。文章复用正文查询结果，优先读取显式 SEO/frontmatter 信息，再读取摘要组件或正文首段，不需要逐篇填写。

需要单独调整文章时，可以在 frontmatter 添加：

```yaml
seo:
  title: 搜索和分享使用的标题
  description: 文章的简短摘要。
  image: /img/book/example/cover.png
  imageAlt: 封面内容说明
```

`title`、`description`、`head`、`author`、`img` 等已有字段仍然可用。书籍相对封面路径自动补 `/img/book/`，普通文章补 `/img/`。只有完整有效的日期会输出文章时间，年份不会自动补成元旦；书籍的 `director` 不会误作文章作者。

`seo.noindex: true` 或已有 robots 限制会保留。没有正文的设计、友情链接数据条目不进入 sitemap；公开的聚合页正常收录。`/test/**` 与错误页不收录，不存在的文章返回 HTTP 404。

`robots.txt` 指向正式站点的 sitemap；RSS 与文章页共用标题、摘要、链接和日期规则。

验证：`node --experimental-strip-types --test tests/seo.test.mjs tests/seo-head.test.mjs`，再运行 `pnpm generate` 检查静态输出。
