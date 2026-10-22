<script setup lang="ts">
import { computed, ref } from "vue";

useSeoMeta({
  title: "Library",
  description: "Books, notes, and things worth learning.",
});

const { data: books } = await useAsyncData("book-gallery", () =>
  queryContent("book").only(["_path", "title", "img", "time", "director", "plan"]).find(),
  { deep: false },
);

const galleryElement = ref<HTMLElement | null>(null);
const failedCovers = ref(new Set<string>());

function dateValue(value: unknown) {
  const match = String(value ?? "").match(/^(\d{4})(?:[.-](\d{1,2}))?(?:[.-](\d{1,2}))?/);
  return match ? Number(match[1]) * 10000 + Number(match[2] || 1) * 100 + Number(match[3] || 1) : 0;
}

function resolveCover(image: string) {
  return /^(https?:\/\/|\/)/.test(image) ? image : `/img/book/${image}`;
}

function readingPercentage(plan: unknown) {
  if (typeof plan !== "string") return null;
  const values = plan.split(",");
  if (values.length !== 2 || values.some(value => !value.trim())) return null;
  const [current, total] = values.map(Number);
  if (!Number.isFinite(current) || !Number.isFinite(total) || current < 0 || total <= 0) return null;
  return Math.round(Math.min(current / total, 1) * 100);
}

const covers = computed(() => (books.value ?? [])
  .filter(book => book._path && typeof book.img === "string" && book.img.trim() && !failedCovers.value.has(book._path))
  .sort((a, b) => dateValue(b.time) - dateValue(a.time))
  .map(book => {
    const title = book.title || "查看文章";
    const authorValue = String(book.director ?? "").trim();
    const author = /^n\/a$/i.test(authorValue) ? "" : authorValue;
    const percentage = readingPercentage(book.plan);
    const status = percentage === null ? "" : percentage === 100 ? "已读" : percentage === 0 ? "未开始" : "阅读中";
    return {
      path: book._path!,
      title,
      author,
      percentage,
      status,
      label: [title, author, percentage === null ? "" : `${status} ${percentage}%`].filter(Boolean).join("，"),
      src: resolveCover(book.img.trim()),
      // Local covers share this format; the protocol book is one pixel wider.
      width: book.img === "attacking-network-protocols/1.png" ? 586 : 585,
      height: 770,
    };
  }),
);

function hideFailedCover(path: string) {
  failedCovers.value.add(path);
}

onNuxtReady(() => {
  // An SSR image can finish before its error listener is attached.
  for (const image of galleryElement.value?.querySelectorAll<HTMLImageElement>("img[data-book-path]") ?? []) {
    if (image.complete && !image.naturalWidth) hideFailedCover(image.dataset.bookPath!);
  }
});
</script>

<template>
  <main class="library-container" aria-label="书籍封面">
    <div ref="galleryElement" class="cover-gallery">
      <NuxtLink v-for="(book, index) in covers" :key="book.path" :to="book.path"
        class="cover-link" :aria-label="book.label">
        <img :src="book.src" alt="" :width="book.width" :height="book.height" :data-book-path="book.path"
          :loading="index < 4 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async" @error="hideFailedCover(book.path)" />
        <span class="cover-details" aria-hidden="true">
          <strong class="cover-title">{{ book.title }}</strong>
          <span v-if="book.author" class="cover-author">{{ book.author }}</span>
          <span v-if="book.percentage !== null" class="cover-reading">
            <span>{{ book.status }}</span><span class="cover-percentage">{{ book.percentage }}%</span>
          </span>
          <span v-if="book.percentage !== null" class="cover-progress-track">
            <span class="cover-progress-fill" :style="{ width: `${book.percentage}%` }"></span>
          </span>
        </span>
      </NuxtLink>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.library-container {
  --gallery-gap: 0.375rem;
  min-height: 100dvh;
  padding: clamp(0.5rem, 0.75vw, 1rem);
  box-sizing: border-box;
  background: #fff;
}

.cover-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(14rem, 20vw, 18rem), 1fr));
  align-items: start;
  gap: var(--gallery-gap);
  width: 100%;
  min-width: 0;
  margin: 0 auto;
}

.cover-link {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 0;
  text-decoration: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    transition: opacity 0.25s ease;
  }

  &:focus-visible {
    outline: 1px solid #007f73;
    outline-offset: 4px;
  }

  &:focus-visible .cover-details { opacity: 1; transform: translateY(0); }
}

.cover-details {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: clamp(0.875rem, 1.5vw, 1.5rem);
  box-sizing: border-box;
  background: linear-gradient(180deg, transparent 25%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.96) 100%);
  color: #ededed;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace;
  line-height: 1.5;
  text-transform: none;
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.cover-title { font-size: clamp(0.9375rem, 1.2vw, 1.125rem); font-weight: 600; overflow-wrap: anywhere; }
.cover-author { color: #b3b3b3; font-size: 0.75rem; overflow-wrap: anywhere; }
.cover-reading { display: flex; justify-content: space-between; gap: 0.5rem; margin-top: 0.25rem; color: #b3b3b3; font-size: 0.6875rem; }
.cover-percentage { color: #38e7cd; font-variant-numeric: tabular-nums; }
.cover-progress-track { display: block; width: 100%; height: 2px; background: #ffffff33; }
.cover-progress-fill { display: block; height: 100%; background: #38e7cd; }

.dark-mode .library-container { background: #000; }
.dark-mode .cover-link {
  img { opacity: 0.7; }
  &:focus-visible { outline-color: #38e7cd; }
}

@media (hover: hover) {
  .cover-link:hover img { opacity: 0.9; }
  .cover-link:hover .cover-details { opacity: 1; transform: translateY(0); }
  .dark-mode .cover-link:hover img { opacity: 1; }
}

@media (max-width: 640px) {
  .library-container { --gallery-gap: 0.25rem; padding: 0.375rem; }
  .cover-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cover-details { gap: 0.375rem; padding: 0.625rem; }
  .cover-title { font-size: 0.8125rem; }
  .cover-author, .cover-reading { font-size: 0.6875rem; }
}

@media (hover: none) {
  .cover-details {
    inset: auto 0 0;
    opacity: 1;
    transform: none;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.94) 45%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cover-link img, .cover-details { transition: none; }
  .cover-details { transform: none; }
}
</style>
