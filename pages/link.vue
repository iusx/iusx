<script lang="ts" setup>
useSeoMeta({
  title: "Friendly link",
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
    <div class="main-layout">
      <div class="main-box">
        <div class="title">
          <this-page>友情链接 </this-page>
        </div>
        <div class="links-container">
          <a
            :href="link.url"
            target="_blank"
            class="background"
            v-for="link in sortedData"
          >
            <div class="links-con-img">
              <div v-if="loading" class="no-img"></div>
              <template v-else>
                <img class="img" :src="link.img" :alt="link.name" />
                <img class="text" src="/img/page/link/text.webp" />
              </template>
            </div>
            <p>{{ link.name }}</p>
          </a>
        </div>
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
main {
  background: #616161;
  width: 100%;
  height: 100vh;

  .main-layout {
    background: #616161;
    margin: 0 auto;
    padding: 20px;

    .title {
      text-align: center;
      margin-bottom: 30px;
    }

    .links-container {
      display: grid;
      justify-items: center;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .background {
      width: 200px;
      height: 280px;
      text-decoration: none;
      background: url("/img/page/link/back.webp") no-repeat center center;
      background-size: contain;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
      .links-con-img {
        display: grid;
        align-items: end;
        justify-items: start;
        .img {
          width: 110px;
          height: 110px;
          object-fit: cover;
          margin-bottom: 10px;
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          z-index: 2;
        }

        .text {
          width: 110px;
          height: 110px;
          object-fit: cover;
          margin-bottom: 10px;
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          z-index: 2;
          padding-top: 6px;
        }
      }

      p {
        color: #df5957;
        font-size: 14px;
        text-align: center;
        margin: 0;
        line-height: 1.2;
      }
    }
  }
  .no-img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    animation: loading 1.5s infinite;
  }
}
</style>
