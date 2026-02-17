<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

useSeoMeta({
  title: "Library Archive",
  description: "Input Source & Knowledge Base",
});

const { data: equalQueryBook } = await useAsyncData("equalBook", () => {
  return queryContent("book/").find();
});

const sortedData = computed(() => {
  if (!equalQueryBook.value) return [];
  return [...equalQueryBook.value].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
});

const mainContainer = ref<HTMLElement | null>(null);

const resolveCover = (path: string) => {
  if (!path) return "";

  if (path.startsWith("/img/book/") || path.startsWith("http")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/img/book/${cleanPath}`;
};

const removeSkeleton = (img: HTMLImageElement, status: "success" | "error") => {
  const parent = img.closest(".cover-wrapper");
  if (parent) {
    parent.classList.add("is-loaded");
    if (status === "error") parent.classList.add("has-error");
  }
};

const handleImageLoad = (e: Event) => {
  removeSkeleton(e.target as HTMLImageElement, "success");
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  console.error("❌ Image Failed:", img.src);
  removeSkeleton(img, "error");
};

onMounted(() => {
  if (mainContainer.value) {
    const images = mainContainer.value.querySelectorAll("img.cover-img");
    images.forEach((img: any) => {
      if (img.complete && img.naturalWidth > 0) {
        removeSkeleton(img, "success");
      }
    });
  }

  const ctx = gsap.context(() => {
    gsap.from(".archive-header", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from(".book-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: ".book-grid", start: "top 85%" },
    });
  }, mainContainer.value);

  return () => ctx.revert();
});
</script>

<template>
  <main ref="mainContainer" class="library-container">
    <header class="archive-header">
      <div class="header-meta">
        <span>// KNOWLEDGE_BASE</span>
        <span>TOTAL_ITEMS: {{ sortedData.length }}</span>
      </div>
      <h1 class="title">LEARN<br />FOR COOL<span class="dot">.</span></h1>
      <div class="divider"></div>
    </header>

    <div class="library-content">
      <div class="book-grid">
        <nuxt-link
          v-for="book in sortedData"
          :key="book._path"
          :to="book._path"
          class="book-card"
        >
          <div class="cover-wrapper">
            <div class="skeleton-loader"></div>
            <div class="error-msg">NOT FOUND</div>
            <img
              :src="resolveCover(book.img)"
              :alt="book.title"
              class="cover-img"
              loading="lazy"
              @load="handleImageLoad"
              @error="handleImageError"
            />

            <div class="sheen"></div>
          </div>

          <div class="book-info">
            <div class="info-header">
              <span class="status-tag">
                <span class="status-dot"></span> {{ book.status || "ARCHIVED" }}
              </span>
              <span class="year">{{ book.time?.slice(0, 4) }}</span>
            </div>
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author || "Unknown Author" }}</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$font-mono: "JetBrains Mono", monospace;
$accent-color: #00e2c1;
$book-ratio: 0.66;

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.library-container {
  min-height: 100vh;
  padding: 6vw 5vw;
  background-color: #f4f4f4;
  color: #111;
  font-family: $font-mono;
}

.archive-header {
  margin-bottom: 5rem;
  .header-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  .title {
    font-family: "Helvetica Neue", sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    line-height: 0.9;
    margin: 0;
    letter-spacing: -0.02em;
    .dot {
      color: $accent-color;
    }
  }
  .divider {
    width: 100%;
    height: 2px;
    background: #d9d8d8;
    margin-top: 2rem;
    transform-origin: left;
  }
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 3rem 2rem;
  perspective: 1000px;
}

.book-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  .cover-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: $book-ratio;
    background-color: #e0e0e0;
    border-radius: 2px 6px 6px 2px;
    transform-style: preserve-3d;
    transition:
      transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      box-shadow 0.4s ease;
    cursor: pointer;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .skeleton-loader {
      position: absolute;
      inset: 0;
      z-index: 2;
      background: #ddd;
      overflow: hidden;
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
    }

    .error-msg {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #333;
      color: #ef0000;
      font-weight: bold;
      font-size: 12px;
      text-align: center;
      display: none;
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 2px 6px 6px 2px;
      position: relative;
      z-index: 3;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .sheen {
      position: absolute;
      inset: 0;
      z-index: 4;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
      );
      pointer-events: none;
      opacity: 0.5;
    }

    &.is-loaded {
      .skeleton-loader {
        display: none;
      }
      .cover-img {
        opacity: 1;
      }
    }

    &.has-error {
      .skeleton-loader {
        display: none;
      }
      .error-msg {
        display: flex;
      }
      border: 2px solid red;
    }
  }

  .book-info {
    margin-top: 1.2rem;
    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
      .status-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        .status-dot {
          width: 6px;
          height: 6px;
          background: #000;
          border-radius: 50%;
        }
      }
    }
    .book-title {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3;
      margin: 0 0 0.3rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .book-author {
      font-size: 0.85rem;
      color: #555;
      margin: 0;
      font-style: italic;
    }
  }

  &:hover {
    .cover-wrapper {
      transform: rotateY(-15deg) rotateX(5deg) scale(1.03) translateZ(10px);
      box-shadow:
        -10px 15px 30px rgba(0, 0, 0, 0.2),
        -5px 5px 10px rgba(0, 0, 0, 0.1);
      .sheen {
        opacity: 0.8;
      }
    }
    .book-title {
      color: $accent-color;
    }
    .status-dot {
      background: $accent-color;
      box-shadow: 0 0 5px $accent-color;
    }
  }
}

.dark-mode {
  .library-container {
    background-color: #0a0a0a;
    color: #eee;
  }
  .archive-header {
    .header-meta {
      color: #888;
    }
    .divider {
      background: #333;
    }
  }
  .book-card {
    .cover-wrapper {
      background-color: #222;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      .skeleton-loader {
        background: #1a1a1a;
        &::after {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
        }
      }
    }
    .book-info {
      .info-header {
        color: #888;
        .status-dot {
          background: #fff;
        }
      }
      .book-title {
        color: #ddd;
      }
      .book-author {
        color: #666;
      }
    }
    &:hover {
      .cover-wrapper {
        box-shadow: -10px 15px 40px rgba(0, 0, 0, 0.6);
      }
      .book-title {
        color: #fff;
      }
      .status-dot {
        background: $accent-color;
      }
    }
  }
}
</style>
