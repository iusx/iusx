<script lang="ts" setup>
const { data: links } = await useAsyncData("friendly-links", () =>
  queryContent("link/").only(["_path", "url", "img", "name", "time"]).find(),
  { deep: false },
);

const board = ref<HTMLElement | null>(null);
const failedImages = ref(new Set<string>());

function dateValue(value: unknown) {
  const parts = String(value ?? "").match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  return parts ? Number(parts[1]) * 10000 + Number(parts[2]) * 100 + Number(parts[3]) : 0;
}

function siteDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const sortedData = computed(() => [...(links.value ?? [])]
  .sort((a, b) => dateValue(b.time) - dateValue(a.time))
  .map(link => ({ ...link, domain: siteDomain(link.url) })),
);

// An SSR image can fail before Vue attaches its error listener.
onNuxtReady(() => {
  for (const image of board.value?.querySelectorAll<HTMLImageElement>("img[data-avatar]") ?? []) {
    if (image.complete && !image.naturalWidth) failedImages.value.add(image.dataset.avatar!);
  }
});
</script>

<template>
  <main class="links-page">
    <div class="links-layout">
      <NuxtLink to="/" class="home-link"><span aria-hidden="true">←</span> HOME</NuxtLink>

      <header class="links-header">
        <div>
          <p class="page-label">Friends &amp; neighbours</p>
          <h1>友情链接</h1>
        </div>
        <p class="link-count"><span>{{ String(sortedData.length).padStart(2, '0') }}</span> 个站点</p>
      </header>

      <ul ref="board" class="links-board" aria-label="朋友们的网站">
        <li v-for="link in sortedData" :key="link._path" class="link-item">
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="friend-link"
            :aria-label="`${link.name}，${link.domain}（在新标签页打开）`"
          >
            <span class="poster" aria-hidden="true">
              <span class="poster-portrait">
                <span class="avatar-fallback">{{ Array.from(link.name ?? '?')[0] }}</span>
                <img
                  v-if="link.img && !failedImages.has(link._path)"
                  class="avatar"
                  :src="link.img"
                  :data-avatar="link._path"
                  alt=""
                  width="160"
                  height="160"
                  decoding="async"
                  @error="failedImages.add(link._path)"
                />
                <img class="poster-overlay" src="/img/page/link/text.webp" alt="" width="160" height="160" />
              </span>
              <span class="poster-name">{{ link.name }}</span>
            </span>
            <span class="link-caption">
              <span class="link-domain">{{ link.domain }}</span>
              <span class="link-arrow" aria-hidden="true">↗</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.links-page {
  --links-bg: #f3f3f0;
  --links-ink: #242725;
  --links-muted: #666b67;
  --links-rule: #cccfc9;
  --links-accent: #087d70;
  box-sizing: border-box;
  min-height: calc(100vh - var(--site-menu-height, 0px));
  min-height: calc(100dvh - var(--site-menu-height, 0px));
  background: var(--links-bg);
  color: var(--links-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace;
}

.links-layout {
  box-sizing: border-box;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 64px) clamp(24px, 4vw, 56px) 64px;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--links-muted);
  font-size: 12px;
  line-height: 1.5;
  text-decoration: none;
  letter-spacing: 0.06em;

  &:hover { color: var(--links-accent); }
}

.links-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding: 48px 0 28px;

  h1 {
    margin: 8px 0 0;
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.35;
    font-weight: 600;
    letter-spacing: -0.035em;
  }
}

.page-label,
.link-count {
  margin: 0;
  color: var(--links-muted);
  font-size: 12px;
  line-height: 1.6;
}

.link-count {
  flex-shrink: 0;
  padding-bottom: 4px;

  span {
    margin-right: 6px;
    color: var(--links-ink);
    font-variant-numeric: tabular-nums;
  }
}

.links-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(224px, 100%), 1fr));
  gap: 44px 24px;
  margin: 0;
  padding: 40px 0 32px;
  border-block: 1px solid var(--links-rule);
  list-style: none;
}

.link-item {
  min-width: 0;
  display: flex;
  justify-content: center;
}

.links-page .friend-link {
  display: block;
  width: 100%;
  max-width: 260px;
  color: var(--links-ink);
  text-decoration: none;
}

.poster {
  display: block;
  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 1080 / 1527;
  transition: transform 180ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    // Keep the original paper and tape; trim only the image's outer matte.
    background: url("/img/page/link/back.webp") center / contain no-repeat;
    -webkit-mask: url("/img/page/link/back-mask.svg") center / contain no-repeat;
    mask: url("/img/page/link/back-mask.svg") center / contain no-repeat;
  }
}

.poster-portrait {
  display: grid;
  position: absolute;
  top: 27.1%;
  left: 24.5%;
  width: 52%;
  aspect-ratio: 1;
  background: #e7e5df;

  > * {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }
}

.avatar-fallback {
  display: grid;
  place-items: center;
  color: #555a56;
  font-size: 32px;
}

.avatar,
.poster-overlay {
  display: block;
  object-fit: cover;
}

.poster-overlay { pointer-events: none; }

.poster-name {
  position: absolute;
  top: 67.8%;
  left: 13%;
  width: 74%;
  color: #ac3336;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  overflow-wrap: anywhere;
}

.link-caption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  padding: 14px 8% 0;
  color: var(--links-muted);
  font-size: 12px;
  line-height: 1.6;
}

.link-domain { overflow-wrap: anywhere; }
.link-arrow { flex-shrink: 0; }

.friend-link:hover,
.friend-link:focus-visible {
  .poster { transform: translateY(-4px); }
  .link-caption { color: var(--links-accent); }
}

.home-link:focus-visible,
.friend-link:focus-visible {
  outline: 2px solid var(--links-accent);
  outline-offset: 6px;
}

.board-note {
  margin: 18px 0 0;
  color: var(--links-muted);
  font-size: 12px;
  line-height: 1.7;

  span { margin-left: 6px; }
}

.dark-mode .links-page {
  --links-bg: #080a09;
  --links-ink: #d7dcd8;
  --links-muted: #909a94;
  --links-rule: #2c322e;
  --links-accent: #2dd4bf;
}

@media (max-width: 600px) {
  .links-header { padding-top: 32px; gap: 12px; }
  .links-board { padding-block: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .poster { transition: none; }
  .friend-link:hover .poster,
  .friend-link:focus-visible .poster { transform: none; }
}
</style>
