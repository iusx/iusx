<script lang="ts" setup>
const { data: links } = await useAsyncData("friendly-links", () =>
  queryContent("link/").only(["_path", "url", "img", "name", "time"]).find(),
  { deep: false },
);

const sortedData = computed(() => [...(links.value ?? [])]
  .sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  }),
);
const { loading } = useImagePreload(() => sortedData.value.map(item => item.img));
</script>

<template>
  <main class="links-page">
    <div class="wall-stencil" aria-hidden="true"></div>
    <div class="main-layout">
      <header class="archive-header">
        <div class="title">
          <span class="archive-kicker">OUTPOST / CONTACT ARCHIVE</span>
          <this-page :color="{ light: '#202720', dark: '#e6e1d2' }">友情链接 </this-page>
        </div>
        <div class="archive-count">
          <strong>{{ String(sortedData.length).padStart(2, '0') }}</strong>
          <span>份联络档案<br /><small>CONTACTS FOUND</small></span>
        </div>
      </header>
      <section class="main-box" aria-label="友情链接悬赏告示板">
        <div class="board-heading">
          <span class="board-heading-label"><span class="warning-mark" aria-hidden="true">!</span> 外部联络档案</span>
          <span class="board-file" aria-hidden="true">FILE: FRIENDS_<br />ACCESS / EXTERNAL</span>
        </div>
        <div class="links-container">
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="background"
            v-for="link in sortedData"
            :key="link._path"
          >
            <div class="links-con-img">
              <div v-if="loading" class="no-img"></div>
              <template v-else>
                <img class="img" :src="link.img" :alt="link.name" />
                <img class="text" src="/img/page/link/text.webp" alt="" />
              </template>
            </div>
            <p>{{ link.name }}</p>
          </a>
        </div>
        <div class="board-footer">
          <span class="archive-stamp" aria-hidden="true">联络档案 / ARCHIVED</span>
        </div>
      </section>
      <div class="archive-baseline" aria-hidden="true"><span>COMMUNITY CONNECTIONS</span><span>END OF ARCHIVE //</span></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@keyframes loading {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
.links-page {
  --scene-bg: #b5b4a3;
  --scene-ink: #202720;
  --scene-muted: #252c24;
  --scene-seam: rgba(36, 43, 35, 0.18);
  --board-bg: #444b43;
  --board-frame: #606457;
  --board-text: #e6e0cc;
  --board-muted: #c3c3b1;
  --hazard-yellow: #d0af54;
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  background-color: var(--scene-bg);
  background-image:
    radial-gradient(ellipse at 4% 8%, rgba(129, 62, 30, 0.32), transparent 35%),
    radial-gradient(ellipse at 96% 90%, rgba(112, 55, 28, 0.25), transparent 32%),
    repeating-linear-gradient(90deg, transparent 0 239px, var(--scene-seam) 239px 241px, transparent 241px 480px),
    repeating-linear-gradient(0deg, transparent 0 159px, var(--scene-seam) 159px 161px, transparent 161px 320px);
  width: 100%;
  min-height: calc(100vh - var(--site-menu-height, 0px));
  min-height: calc(100dvh - var(--site-menu-height, 0px));

  // Static corrosion and panel seams form the wall behind the notice board.
  &::before {
    content: "";
    position: absolute;
    pointer-events: none;
    inset: 0;
    z-index: -2;
    background: url("/img/page/link/board-grain.svg") repeat;
    background-size: 320px 320px;
    mix-blend-mode: soft-light;
    opacity: 0.9;
  }

  .main-layout {
    max-width: 1400px;
    margin: 0 auto;
    padding: clamp(28px, 5vw, 64px) clamp(16px, 3vw, 40px) 64px;
    box-sizing: border-box;

    .archive-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      color: var(--scene-ink);
    }

    .title {
      border-left: 6px solid var(--scene-ink);
      padding-left: 18px;

      .archive-kicker {
        display: block;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
      }

      :deep(.about) {
        margin: 0;
        padding: 10px 0 0;
        font-size: clamp(24px, 3vw, 34px);
        font-weight: 700;
      }

      :deep(.about small) {
        color: var(--scene-muted);
      }
    }

    .main-box {
      position: relative;
      isolation: isolate;
      border: 8px solid var(--board-frame);
      background-color: var(--board-bg);
      background-image:
        linear-gradient(rgba(16, 20, 16, 0.12), rgba(16, 20, 16, 0.12)),
        url("/img/page/link/wasteland-wall.webp");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: 0 0 0 2px #20261e, inset 0 0 0 2px #20261e, 8px 10px 0 rgba(0, 0, 0, 0.2);
      color: var(--board-text);

      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
        pointer-events: none;
        background: repeating-linear-gradient(135deg, var(--hazard-yellow) 0 10px, #22281f 10px 20px);
        opacity: 0.9;
      }

      &::before { top: 0; }
      &::after { bottom: 0; }
    }

    .links-container {
      display: grid;
      justify-items: center;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 24px 40px;
      box-sizing: border-box;
    }

    .background {
      position: relative;
      isolation: isolate;
      width: 200px;
      height: 280px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      transition: transform 0.3s ease;

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        // Trim only the original outer matte; retain the poster's artwork and typography.
        background: url("/img/page/link/back.webp") center / contain no-repeat;
        -webkit-mask: url("/img/page/link/back-mask.svg") center / contain no-repeat;
        mask: url("/img/page/link/back-mask.svg") center / contain no-repeat;
      }

      &:hover {
        transform: translateY(-5px);
      }

      &:focus-visible {
        outline: 2px dashed var(--hazard-yellow);
        outline-offset: 5px;
      }
      .links-con-img {
        display: grid;
        align-items: end;
        justify-items: start;
        .img {
          width: 110px;
          height: 110px;
          object-fit: cover;
          margin-bottom: 10px;
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          z-index: 2;
        }

        .text {
          width: 110px;
          height: 110px;
          object-fit: cover;
          margin-bottom: 10px;
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          z-index: 2;
          padding-top: 6px;
        }
      }

      p {
        color: #df5957;
        font-size: 14px;
        text-align: center;
        margin: 0;
        line-height: 1.2;
      }
    }
  }
  .no-img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    animation: loading 1.5s infinite;
  }
}

.archive-count {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  strong { font-size: 48px; line-height: 1; font-weight: 900; letter-spacing: -0.06em; }
  span { font-size: 12px; line-height: 1.8; }
  small { font-size: 9px; letter-spacing: 0.08em; color: var(--scene-muted); }
}

.board-heading,
.board-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace;
}

.board-heading {
  margin: 10px 24px 0;
  padding: 22px 0 18px;
  border-bottom: 1px solid rgba(230, 224, 204, 0.25);
}

.board-heading-label { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.08em; }
.warning-mark { display: inline-grid; place-items: center; width: 20px; height: 20px; background: var(--hazard-yellow); color: #22281f; font-weight: 900; }
.board-file { color: var(--board-muted); text-align: right; font-size: 10px; line-height: 1.8; letter-spacing: 0.06em; }

.board-footer {
  margin: 0 24px 10px;
  padding: 20px 0;
  border-top: 1px dashed rgba(230, 224, 204, 0.3);
  color: var(--board-muted);
  font-size: 12px;
  line-height: 1.8;
}

.selection-mark { color: var(--hazard-yellow); margin-right: 6px; }
.archive-stamp { flex-shrink: 0; color: #ecc0a8; border: 2px solid #a85f4d; padding: 2px 10px; font-size: 11px; letter-spacing: 0.06em; transform: rotate(-5deg); }
.archive-baseline { display: flex; justify-content: space-between; gap: 16px; padding-top: 24px; font: 10px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.12em; color: var(--scene-muted); }
.wall-stencil { position: absolute; right: 2%; bottom: 16px; z-index: -1; width: 320px; height: 240px; background: url("/img/page/link/wasteland-stencil.svg") center / contain no-repeat; opacity: 0.45; pointer-events: none; }

.dark-mode .links-page {
  --scene-bg: #171c18;
  --scene-ink: #e6e1d2;
  --scene-muted: #a9b09f;
  --scene-seam: rgba(0, 0, 0, 0.45);
  --board-bg: #2c342d;
  --board-frame: #4d5548;
}

@media (max-width: 600px) {
  .links-page .main-layout {
    .archive-header { align-items: flex-end; gap: 12px; margin-bottom: 24px; }
    .title { padding-left: 10px; border-left-width: 4px; }
    .title .archive-kicker { font-size: 8px; letter-spacing: 0.04em; }
    .title :deep(.about small) { font-size: 12px; }
    .main-box { border-width: 5px; background-position: center, left center; }
    .links-container { padding: 24px 12px 30px; grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); }
  }
  .archive-count { gap: 6px; }
  .archive-count strong { font-size: 32px; }
  .archive-count span { font-size: 10px; }
  .archive-count small, .board-file, .archive-baseline { display: none; }
  .board-heading { margin-inline: 12px; padding-top: 20px; }
  .board-heading-label { font-size: 12px; }
  .board-footer { margin-inline: 12px; flex-direction: column; align-items: flex-start; }
  .archive-stamp { align-self: flex-end; margin: 4px 0; }
  .wall-stencil { width: 220px; height: 165px; }
}

@media (prefers-reduced-motion: reduce) {
  .links-page .main-layout .background { transition: none; }
  .links-page .no-img { animation: none; }
}
</style>
