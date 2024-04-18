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
</script>

<template>
  <main>
    <img :src="'/img/' + img" alt="page-image" />
    <div class="info">
      <p>{{ info }}</p>
      <img :src="'/img/page/' + type + '.png'" alt="page-image-copyright" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
img {
  width: 100%;
}
.info {
  display: flex;
  margin-top: 0.4em;
  @media (max-width: 425px) {
    display: none;
  }
  p {
    margin: 0;
    line-height: 1;
    font-size: 14px;
    color: #7f7f7f;
    padding-right: 3em;
  }
  img {
    width: 61px;
    height: max-content;
  }
}
</style>
