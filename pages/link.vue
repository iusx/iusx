<script lang="ts" setup>
useSeoMeta({
  title: "Friendly link - ritsu",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

const colorMode = useColorMode();

const { data: equalQueryLink } = await useAsyncData("equalLink", () => {
  return queryContent("link/").find();
});

if (equalQueryLink.value) {
  equalQueryLink.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}
const sortedData = computed(() => equalQueryLink.value);

const firstImg = computed(() => {
  return sortedData.value.length > 0 ? sortedData.value[0].img : null;
});

const images = ref([]);
const loading = ref(true);
const imagesLoadedCount = ref(0);

console.log("fuck", firstImg);
onMounted(() => {
  sortedData.value.forEach((item) => {
    const formattedPath = item.img;
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
  <main>
    <div class="title">
      <a href="/"
        ><Icon name="BackIcon" size="2.2vh" />
        <p>友情链接</p></a
      >
    </div>
    <div class="main-layout">
      <div class="main-box" v-for="link in sortedData">
        <a :href="link.url" target="_blank">
          <div v-if="loading" class="no-img"></div>
          <img v-else :src="link.img" :alt="link.name" />
          <div class="main-box-title">{{ link.name }}</div>
        </a>
      </div>
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

.no-img {
  background-color: #f2f2f2;
  animation: loading 1.5s infinite;
  display: block;
  height: 414px;
  width: 100%;
  aspect-ratio: 54 / 71;
}

.dark-mode .no-img {
  background-color: rgb(29, 29, 29);
}

.main-layout {
  margin-top: 2vw;
}
.dark-mode .main-box {
  background: #ffffff17;
  box-shadow: 0px 4px 64.5px 11px rgb(255 255 255 / 12%);
}
.dark-mode .main-box img {
  filter: brightness(0.5);
}
.main-box a {
  text-decoration: none;
}
.main-box {
  background: transparentize;
  padding: 1vw;
  box-shadow: 0px 4px 64.5px 11px rgb(0 0 0 / 12%);
  cursor: pointer;
  transition:
    filter 01.3s ease,
    opacity 0.3s ease;
  margin-bottom: 5vw;
  img {
    width: 100%;
    border-right: 3px;
  }
  .main-box-title {
    margin-top: 0.8vw;
    font-size: 1.2vw;
    color: #424242;
    @media (max-width: 1440px) {
      font-size: 2vw;
      margin-top: 2vw;
      margin-bottom: 2vw;
    }
  }
  &:hover {
    opacity: 0.5;
  }
}
.title a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #000;
  p {
    padding: a;
    margin: 0;
    font-weight: bold;
    font-size: 1.1vw;
    @media (max-width: 1440px) {
      font-size: 2vw;
    }
  }
}
.dark-mode a {
  color: #8b8b8b;
}
main {
  width: 25%;
  margin: 0 auto;
  @media (max-width: 1440px) {
    width: 60% !important;
    border: 1px solid red;
  }
  margin-top: 10%;
}
</style>
