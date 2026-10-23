import { cp } from "node:fs/promises";
import { join } from "node:path";
import { highlightLanguages } from "./utils/highlight-languages";
import { prepareDevDependencyIncludes } from "./utils/dev-dependencies";
import { SITE_SEO } from "./utils/seo";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: { pageTransition: { name: "hacker-page", mode: "out-in" } },
  devtools: { enabled: true },
  hooks: {
    ready(nuxt) {
      if (!nuxt.options.dev) return;
      nuxt.hook("vite:configResolved", (config, { isClient }) => {
        if (!isClient) return;
        config.optimizeDeps ||= {};
        config.optimizeDeps.include = prepareDevDependencyIncludes(config.optimizeDeps.include);
        // Nuxi shares its HTTP server with HMR. Nuxt 3.11 adds a standalone
        // port afterwards; let Vite use the page's port for that shared server.
        const hmr = config.server?.hmr;
        if (hmr && typeof hmr === "object" && hmr.server) {
          hmr.port = undefined;
          hmr.protocol = undefined;
        }
      });
    },
  },
  nitro: {
    prerender: { routes: ["/rss.xml", "/robots.txt"] },
    hooks: {
      async "prerender:init"(nitro) {
        // Nuxt 3.11 copies public files after prerendering. Copy them before
        // Nitro builds its asset manifest so SSR file requests resolve correctly.
        await cp(join(nitro.options.rootDir, "public"), nitro.options.output.publicDir, { recursive: true });
      },
    },
  },
  modules: [
    "@nuxt/content",
    "nuxt-icon",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "nuxt-og-image",
    "nuxt-site-config",
  ],
  site: {
    url: SITE_SEO.url,
    name: SITE_SEO.name,
    description: SITE_SEO.description,
    defaultLocale: SITE_SEO.language,
  },
  sitemap: {
    strictNuxtContentPaths: true,
    excludeAppSources: ["nuxt:prerender"],
    exclude: ["/test", "/test/**"],
    autoLastmod: false,
  },
  routeRules: {
    "/test/**": { headers: { "X-Robots-Tag": "noindex, follow" } },
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
      langs: [...highlightLanguages],
    },
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-mathjax"],
    },
  },
});
