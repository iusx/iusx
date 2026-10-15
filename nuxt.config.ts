// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: { pageTransition: { name: "hacker-page", mode: "out-in" } },
  devtools: { enabled: true },
  nitro: { prerender: { routes: ["/rss.xml"] } },
  modules: [
    "@nuxt/content",
    "nuxt-icon",
    "nuxt-swiper",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "nuxt-og-image",
    "nuxt-site-config",
  ],
  site: {
    url: "https://m.ritsu.jiangxue.org/",
  },
  ogImage: {
    defaults: {
      component: "Custom",
    },
    strictNuxtContentPaths: true,
  },
  content: {
    transformers: ["~/transformers/book-headings.ts"],
    highlight: {
      theme: {
        default: "github-light",
        "dark-mode": "github-dark",
      },
      langs: [
        "bash", "css", "html", "vue", "yaml", "markdown",
        "toml", "lua", "viml", "ruby", "typescript", "javascript",
        "prolog", "scala", "lisp", "python", "clojure", "haskell",
        "java", "erlang", "rust", "json", "diff",
      ],
    },
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-mathjax"],
    },
  },
});
