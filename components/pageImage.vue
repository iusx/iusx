<script setup lang="ts">
import { defineProps } from "vue";

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
      <SwiperSlide v-for="(item, index) in images" :key="index"
        ><a :href="item" target="_blank"
          ><p class="tips">→</p>
          <img :src="item" alt="page-image" /></a
      ></SwiperSlide>
    </Swiper>
    <div class="info" v-if="info && type">
      <div class="info-title">{{ info }}</div>
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
  font-size: small;
  background: blue;
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
