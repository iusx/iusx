<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

const props = defineProps({
  sortedData: {
    type: Array,
    default: () => [],
  },
});

const firstImg = props.sortedData.length > 0 ? props.sortedData[0].img : null;

const images = ref([]);

const loading = ref(true);
const imagesLoadedCount = ref(0);

onMounted(() => {
  props.sortedData.forEach((item) => {
    const formattedPath = `/img/book/${item.img}`;
    images.value.push(formattedPath);

    const img = new Image();
    img.src = formattedPath;

    img.onload = () => {
      imagesLoadedCount.value++;
      if (imagesLoadedCount.value === images.value.length) {
        loading.value = false;
      }
    };

    img.onerror = () => {
      console.error(`Failed to load image ${formattedPath}`);
    };
  });
});
</script>

<template>
  <div class="note-book-box-no" v-if="loading" v-for="(des, index) in sortedData"
    :class="{ 'scale-effect': index % 3 !== 1 }">
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
  <NuxtLink :to="des._path" v-else class="note-book-box" v-for="(des, index) in sortedData">
    <img :src="`/img/book/` + des.img" />
    <div class="note-book-box-desc">
      <span>in reading</span>
      <p>
        {{ des.title }}
      </p>
    </div>
  </NuxtLink>
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

.dark-mode .title-desc-about {
  opacity: 0.6;
}

.dark-mode .note-book-box {
  filter: brightness(0.5);
}

.dark-mode .note-book-box-no {
  background-color: rgb(29, 29, 29);
}

.note-book-box-no {
  background-color: #f2f2f2;
  animation: loading 1.5s infinite;
  width: 100%;
  height: 600px;
  margin: 0.3vw;
  cursor: pointer;
  color: white;
  background-size: 100%;

  .note-book-box-desc {
    display: none;
  }
}

.note-book-box {
  display: grid;

  img {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    z-index: 1;
    width: 100%;
  }

  cursor: pointer;
  color: white;
  background-size: 100%;

  .note-book-box-desc {
    opacity: 0;

    align-items: center;
    transition: opacity 0.3s ease-out;
    height: 100%;
    display: flex;
    flex-direction: column;
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    z-index: 2;

    width: 100%;
    justify-content: flex-end;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);

    span {
      font-weight: bold;
      text-transform: uppercase;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      margin: 0 auto;
    }

    p {

      word-wrap: break-word;

      overflow-wrap: break-word;

      white-space: normal;

      max-width: 80%;
      margin: 0 auto;

      padding: 0.5em 0;
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
