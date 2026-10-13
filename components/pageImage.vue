<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  img: {
    type: String,
    default: "",
  },
  info: {
    type: String,
  },
  type: {
    type: String,
  },
});

const images = computed(() => props.img.split(",").map(item => item.trim()).filter(Boolean)
  .map(item => /^(https?:\/\/|\/)/.test(item) ? item : `/img/${item}`));
const failedImages = ref<string[]>([]);
const mediaElement = ref<HTMLElement | null>(null);
const markFailed = (src: string) => {
  if (!failedImages.value.includes(src)) failedImages.value.push(src);
};
onNuxtReady(() => {
  for (const image of mediaElement.value?.querySelectorAll<HTMLImageElement>("img[data-article-image]") || []) {
    if (image.complete && !image.naturalWidth) markFailed(image.getAttribute("src") || "");
  }
});
</script>

<template>
  <figure v-if="images.length" ref="mediaElement" class="article-media">
    <Swiper v-if="images.length > 1" :modules="[SwiperAutoplay, SwiperEffectCreative]" :slides-per-view="1" :loop="true" :effect="'creative'"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: true,
      }" :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }">
      <SwiperSlide v-for="(item, index) in images" :key="item">
        <div v-if="failedImages.includes(item)" class="image-error" role="status">图片暂时无法显示</div>
        <a v-else :href="item" target="_blank" rel="noopener noreferrer" class="image-link">
          <span class="image-original">↗ 查看原图</span>
          <img :src="item" :alt="info || `文章插图 ${index + 1}`" data-article-image
            :loading="index === 0 ? 'eager' : 'lazy'" decoding="async" @error="markFailed(item)" />
        </a>
      </SwiperSlide>
    </Swiper>
    <template v-else>
      <div v-if="failedImages.includes(images[0])" class="image-error" role="status">图片暂时无法显示</div>
      <a v-else :href="images[0]" target="_blank" rel="noopener noreferrer" class="image-link">
        <span class="image-original">↗ 查看原图</span>
        <img :src="images[0]" :alt="info || '文章插图'" data-article-image decoding="async" @error="markFailed(images[0])" />
      </a>
    </template>
    <figcaption v-if="info || type" class="info">
      <span v-if="info" class="info-title">{{ info }}</span>
      <img v-if="type" :src="'/img/page/' + type + '.png'" alt="图片版权标记" />
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.article-media {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-family: var(--article-font, monospace);
}
.image-link {
  position: relative;
  display: block;
  border: 1px solid var(--article-border, #d4d4d4);
  img { display: block; width: 100%; height: auto; border-radius: 0; }
}
.image-original {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 0.375rem 0.625rem;
  border-top: 1px solid var(--article-border, #d4d4d4);
  border-left: 1px solid var(--article-border, #d4d4d4);
  background: var(--article-bg, #fff);
  color: var(--article-muted, #737373);
  font-size: 0.6875rem;
  line-height: 1.5;
}
.image-link:hover .image-original { color: var(--article-accent, #007f73); }
.image-error {
  padding: 3rem 1rem;
  border: 1px solid var(--article-border, #d4d4d4);
  color: var(--article-muted, #737373);
  font-size: 0.8125rem;
}
.info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
  color: var(--article-muted, #737373);
  font-size: 0.75rem;
  line-height: 1.8;
  .info-title { min-width: 0; overflow-wrap: anywhere; }
  img { flex-shrink: 0; width: 61px; height: auto; }
}
.dark-mode .image-link img { opacity: 0.7; }
</style>
