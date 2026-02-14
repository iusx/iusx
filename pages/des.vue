<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

useSeoMeta({
  title: "Design Portfolio",
  description: "Immersive Visual Works",
});

const { data: equalQueryDes } = await useAsyncData("equalDes", () => {
  return queryContent("des/").find();
});

const sortedData = computed(() => {
  if (!equalQueryDes.value) return [];
  return [...equalQueryDes.value].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
});

const mainContainer = ref<HTMLElement | null>(null);

const removeSkeleton = (img: HTMLImageElement) => {
  const parent = img.closest(".img-reveal-mask");
  if (parent) {
    parent.classList.add("is-loaded");
  }
};

const handleImageLoad = (e: Event) => {
  removeSkeleton(e.target as HTMLImageElement);
};

const handleImageError = (e: Event) => {

  removeSkeleton(e.target as HTMLImageElement);
};

onMounted(() => {

  if (mainContainer.value) {
    const images = mainContainer.value.querySelectorAll("img.img-inner");
    images.forEach((img: any) => {
      if (img.complete) {

        removeSkeleton(img);
      }
    });
  }

  const ctx = gsap.context(() => {
    gsap.from(".page-header", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });

    const images = gsap.utils.toArray(".img-inner");
    images.forEach((img: any) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray(".design-item").forEach((item: any) => {
      gsap.from(item.querySelector(".item-info"), {
        y: 30,
        opacity: 0,
        duration: 1,
        scrollTrigger: { trigger: item, start: "top 80%" },
      });
    });
  }, mainContainer.value);

  return () => ctx.revert();
});
</script>

<template>
  <main ref="mainContainer" class="portfolio-container">
    <header class="page-header">
      <this-page>Selected Works</this-page>
      <div class="divider"></div>
    </header>

    <div class="gallery-wrapper">
      <div class="large-grid">
        <article
          v-for="(des, index) in sortedData"
          :key="des._path"
          class="design-item"
        >
          <nuxt-link :to="des.url" target="_blank" class="item-link">
            <div class="img-reveal-mask">
              <div class="skeleton-loader"></div>

              <img
                :src="des.img"
                :alt="des.title"
                class="img-inner"
                loading="lazy"
                @load="handleImageLoad"
                @error="handleImageError"
              />

              <div class="hover-overlay">
                <div class="overlay-border"></div>
                <div class="overlay-content">
                  <span class="action-tag">[ OPEN_PROJECT ]</span>
                  <p class="hover-desc">
                    {{ des.description || des.title }}
                  </p>
                </div>
                <div class="arrow-icon">↗</div>
              </div>
            </div>

            <div class="item-info">
              <div class="info-top">
                <h2>{{ des.title }}</h2>
                <span class="year">{{ des.time?.slice(0, 4) }}</span>
              </div>
              <p class="desc-preview">Visual Design / UI / UX</p>
            </div>
          </nuxt-link>
        </article>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$gap-desktop: 6vw;
$gap-mobile: 4rem;
$img-ratio: 1.6;
$font-mono: "JetBrains Mono", monospace;

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.portfolio-container {
  padding: 8vw 4vw;
  min-height: 100vh;
  background-color: #fff;
  transition: background-color 0.5s ease;
}

.page-header {
  margin-bottom: 8vw;
  :deep(this-page) {
    font-size: clamp(3rem, 8vw, 9rem);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 2rem;
  }
  .divider {
    width: 100%;
    height: 1px;
    background: #000;
    transform-origin: left;
  }
}

.large-grid {
  display: grid;
  column-gap: $gap-desktop;
  row-gap: 8vw;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    row-gap: $gap-mobile;
  }
}

.design-item {
  width: 100%;

  .img-reveal-mask {
    width: 100%;
    aspect-ratio: $img-ratio;
    overflow: hidden;
    position: relative;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    background-color: #f0f0f0;
    transform: translateZ(0);

    .skeleton-loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: #e0e0e0;
      overflow: hidden;
      transition: opacity 0.4s ease; 

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.5),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
    }

    .img-inner {
      width: 100%;
      height: 120%;
      object-fit: cover;
      opacity: 0;
      transform: translateY(-10%);
      transition: opacity 0.6s ease-out;
      position: relative;
      z-index: 2;
    }

    &.is-loaded {
      .skeleton-loader {
        opacity: 0; 
        pointer-events: none;
      }
      .img-inner {
        opacity: 1;
      }
    }

    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(0px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 2rem;
      z-index: 10;

      .overlay-border {
        position: absolute;
        inset: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transform: scale(0.95);
        opacity: 0;
        transition:
          transform 0.4s ease,
          opacity 0.4s ease;
        pointer-events: none;
      }
      .overlay-content {
        transform: translateY(20px);
        transition: transform 0.4s ease;
        .action-tag {
          font-family: $font-mono;
          font-size: 0.8rem;
          color: #38e7cd;
          margin-bottom: 0.5rem;
          display: block;
        }
        .hover-desc {
          font-size: 1.1rem;
          color: #fff;
          font-weight: 500;
          max-width: 80%;
          line-height: 1.4;
          margin: 0;
        }
      }
      .arrow-icon {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 2rem;
        color: #fff;
        opacity: 0;
        transform: translate(-10px, 10px);
        transition: all 0.4s ease;
      }
    }
  }

  .item-info {
    .info-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
      h2 {
        font-size: clamp(1.2rem, 2vw, 2rem);
        font-weight: 500;
        color: #111;
      }
      .year {
        font-family: monospace;
        font-size: 0.9rem;
        color: #888;
      }
    }
    .desc-preview {
      font-size: 0.9rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .item-link {
    text-decoration: none;
    cursor: pointer;
    &:hover {
      .img-inner {
        filter: brightness(0.8);
      }
      .hover-overlay {
        opacity: 1;
        backdrop-filter: blur(4px);
        .overlay-border {
          opacity: 1;
          transform: scale(1);
        }
        .overlay-content {
          transform: translateY(0);
        }
        .arrow-icon {
          opacity: 1;
          transform: translate(0, 0);
        }
      }
      .item-info h2 {
        color: #000;
      }
    }
  }
}

.dark-mode {
  .portfolio-container {
    background-color: #050505;
  }
  .page-header .divider {
    background: #333;
  }

  .design-item {
    .img-reveal-mask {
      background-color: #1a1a1a;
      .skeleton-loader {
        background-color: #1f1f1f;
        &::after {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
        }
      }
      .hover-overlay {
        background: rgba(0, 0, 0, 0.6);
      }
    }
    .item-info {
      .info-top {
        border-bottom-color: rgba(255, 255, 255, 0.1);
        h2 {
          color: #eee;
        }
      }
      .desc-preview {
        color: #555;
      }
    }
  }
}
</style>
