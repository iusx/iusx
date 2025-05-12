<script setup lang="ts">
import { defineProps, onMounted } from "vue";

const props = defineProps({
  img: {
    type: String,
  },
  info: {
    type: String,
  },
  type: {
    type: String,
  },
});

const images = ref(props.img.split(",").map((item) => "/img/" + item));
const loading = ref(true);
const imagesLoadedCount = ref(0);
onMounted(() => {
  images.value.forEach((imageUrl, index) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      imagesLoadedCount.value++;

      if (imagesLoadedCount.value === images.value.length) {
        loading.value = false;
      }
    };

    img.onerror = () => {
      console.error(`Failed to load image ${imageUrl}`);
    };
  });
});
</script>

<template>
  <main>
    <Swiper
      :modules="[SwiperAutoplay, SwiperEffectCreative]"
      :slides-per-view="1"
      :loop="true"
      :effect="'creative'"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: true,
      }"
      :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }"
    >
      <SwiperSlide v-for="(item, index) in images" :key="index">
        <div v-if="loading">
          <an-skeleton :loading="loading" ref="skeletonRef">
            <template #template>
              <an-skeleton-item
                variant="image"
                style="width: 100vw; height: 80vh"
              />
              <div style="padding: 14px">
                <an-skeleton-item variant="h3" style="width: 50%" />
              </div>
            </template>
          </an-skeleton>
        </div>
        <a v-else :href="item" target="_blank">
          <p class="tips">→</p>
          <img :src="item" alt="page-image" />
        </a>
      </SwiperSlide>
    </Swiper>
    <div class="info" v-if="info && type">
      <div class="info-title" style="text-transform: uppercase">{{ info }}</div>
      <img :src="'/img/page/' + type + '.png'" alt="page-image-copyright" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
img {
  width: 100%;
}
a:hover .tips {
  opacity: 0;
}
.tips {
  position: absolute;
  color: #ffffff;
  right: 0;
  bottom: 0;
  font-size: 13px;
  background: #00dd82;
  padding: 10px;
  transition: opacity 0.3s ease;
}
.info {
  display: flex;
  margin-top: 0.4em;
  .info-title {
    margin: 0;
    line-height: 1;
    font-size: 14px;
    color: #7f7f7f;
    padding-right: 3em;
  }
  img {
    width: 61px;
  }
}
</style>
