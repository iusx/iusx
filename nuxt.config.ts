// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: { prerender: { routes: ["/rss.xml"] } },
  modules: [
    "@nuxt/content",
    "nuxt-icon",
    "nuxt-swiper",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
  ],
  site: {
    url: "https://m.ritsu.jiangxue.org/",
  },
  content: {
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: ["rehype-mathjax"],
    },
  },
});
