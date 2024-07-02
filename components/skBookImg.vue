<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

const props = defineProps({
  sortedData: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div
    class="note-book-box"
    v-for="(des, index) in sortedData"
    :class="{ 'scale-effect': index % 3 !== 1 }"
    :style="{
      'background-image': `url('/img/book/${des.img}.png')`,
      'background-repeat': 'no-repeat',
    }"
  >
    <nuxt-link :to="des._path">
      <div class="note-book-box-desc">
        <span>in reading</span>
        <p>
          {{ des.title }}
        </p>
      </div>
      <div class="note-book-state"></div>
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.dark-mode .title-desc-about {
  opacity: 0.6;
}

.dark-mode .note-book-box {
  opacity: 0.5;
}

.note-book-box {
  width: 22vw;
  height: 29vw;
  margin: 0.3vw;
  background: url("/img/book/01.png") no-repeat;
  cursor: pointer;
  color: white;
  border-radius: 5px;
  @media (max-width: 1440px) {
    width: 100vw;
    margin-bottom: 3vw;
    height: 40vh;
  }
  background-size: 100%;
  .note-book-box-desc {
    opacity: 0;
    transition: opacity 0.3s ease-out;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 1vw;
    padding-right: 1vw;
    @media (max-width: 1440px) {
      padding-left: 4vw;
      padding-right: 4vw;
    }
    justify-content: flex-end;
    border-radius: 5px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
    span {
      font-weight: bold;
      text-transform: uppercase;
    }
  }
  &:hover {
    .note-book-box-desc {
      opacity: 1;
    }
  }
}
a {
  color: white;
  text-decoration: none;
}
</style>
