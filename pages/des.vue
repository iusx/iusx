<script lang="ts" setup>
const colorMode = useColorMode();

useSeoMeta({
  title: "Design",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

const { data: equalQueryDes } = await useAsyncData("equalDes", () => {
  return queryContent("des/").find();
});

if (equalQueryDes.value) {
  equalQueryDes.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}
const isWorkPopVisible = ref(false);

const showWorkPop = () => {
  isWorkPopVisible.value = true;
};

const hideWorkPop = () => {
  isWorkPopVisible.value = false;
};

const sortedData = computed(() => equalQueryDes.value);

const firstImg = computed(() => {
  return sortedData.value.length > 0 ? sortedData.value[0].img : null;
});

const images = ref([]);
const loading = ref(true);
const imagesLoadedCount = ref(0);

onMounted(() => {
  sortedData.value.forEach((item) => {
    const formattedPath = `${item.img}`;
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
    <transition name="fade">
      <div class="work-pop">
        <div class="work-pop-layout">
          <div class="work-pop-title">
            <this-page>design</this-page>
          </div>
          <div class="work-pop-des">
            <div class="work-pop-des-box" v-for="des in sortedData">
              <div v-if="loading" class="no-img"></div>
              <nuxt-link :to="des.url" target="_blank" v-else>
                <img :src="des.img" :alt="des.title" />
                <div class="work-desc-box">
                  <p>{{ des.title }}</p>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  height: 100%;
  width: 100%;
  border: 1px soldi red;
}
.dark-mode .no-img {
  background-color: rgb(29, 29, 29);
}

a {
  color: rgb(0, 0, 0);
  text-decoration: none;
}
.work-pop {
  background: rgb(255, 255, 255);
  box-shadow: 0px 4px 45.8px 49px rgba(166, 166, 166, 0.25);
  .work-pop-title {
  }

  .work-pop-layout {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .work-pop-des {
    flex: 1;
    padding-bottom: 20px;
  }

  .work-pop-des-box {
    cursor: pointer;
    transition: filter 0.3s ease;
    margin-bottom: 2vw;
    @media (max-width: 1024px) {
      margin-bottom: 10vw;
    }
    a {
      text-decoration: none;
      display: grid;
      align-items: end;
      justify-items: start;
      transition: transform 0.3s ease;
      cursor: pointer;

      .work-desc-box {
        grid-row: 1 / 2;
        grid-column: 1 / 2;
        z-index: 2;
        padding: 12px;
        background: #ffffff;
        color: #000000;
        text-transform: uppercase;
        font-family: "tsing";
        font-size: 20px;
        transition: padding-left 0.3s ease;
        p {
          padding: 0;
          margin: 0;
          font-weight: bold;
        }
      }

      img {
        width: 100%;
        grid-row: 1 / 2;
        grid-column: 1 / 2;
        z-index: 1;
        width: 100%;
        border-radius: 7px;
      }
    }

    &:hover {
      filter: brightness(1.2);

      .work-desc-box {
        padding-left: 30px;
      }
    }
  }
}
</style>
