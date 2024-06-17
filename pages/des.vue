<script lang="ts" setup>
const colorMode = useColorMode();

useSeoMeta({
  title: "Design - RHYME.Q",
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
</script>
<template>
  <main>
    <transition name="fade">
      <div class="work-pop" v-if="isWorkPopVisible">
        <div class="work-pop-layout">
          <div class="work-pop-title">
            <Icon
              name="DesClose"
              size="2.2vh"
              style="cursor: pointer"
              class="pop-close"
              @click="hideWorkPop"
            />

            <h1>ALL Design</h1>
          </div>
          <div class="work-pop-des">
            <div class="work-pop-des-box" v-for="des in sortedData">
              <nuxt-link :to="des._path">
                <img :src="'/img/des/' + des.img" :alt="des.title" />

                <p>{{ des.title }}</p>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="main-page">
      <div class="all-work" style="z-index: 1111" @click="showWorkPop"></div>
      <div class="des-layout">
        <swiper>
          <swiper-slide
            v-for="des in sortedData"
            style="height: 100vh; width: 100vw"
          >
            <div class="des-box">
              <img :src="'/img/des/' + des.img" :alt="des.title" />
              <nuxt-link :to="des._path">
                <div class="des-title-layout">
                  <div class="des-title">
                    <p>/</p>
                    <span>{{ des.title }}</span>
                  </div>
                  <div class="des-more">MORE +</div>
                </div>
              </nuxt-link>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.work-pop {
  position: absolute;
  height: 100vh; /* 确保 .work-pop 的高度是 100vh */
  width: 30vw;
  background: rgb(255, 255, 255);
  box-shadow: 0px 4px 45.8px 49px rgba(166, 166, 166, 0.25);
  z-index: 9000000999 !important;
  overflow: hidden; /* 禁止 .work-pop 的溢出 */
  @media (max-width: 1024px) {
    width: 50vw;
  }
  @media (max-width: 768px) {
    width: 70vw;
  }
  @media (max-width: 425px) {
    width: 90vw;
  }

  .work-pop-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
  }

  .work-pop-layout {
    margin: 0 auto;
    width: 90%;
    height: 100%; /* 确保 .work-pop-layout 的高度是 100% */
    display: flex;
    flex-direction: column;
  }

  .work-pop-des {
    flex: 1;
    padding-right: 20px;
    overflow-y: auto !important;
    padding-bottom: 20px;
  }

  .work-pop-des-box {
    cursor: pointer;
    transition: filter 0.3s ease;
    margin-bottom: 2vw;
    a {
      text-decoration: none;
    }
    img {
      width: 100%;
      border-radius: 7px;
    }

    p {
      font-size: 22px;
      padding: 0;
      margin: 0;
      margin-top: 1vw;
      font-weight: bold;
    }

    &:hover {
      filter: brightness(1.2);
    }
  }
}

.all-work {
  top: -10px;
  position: absolute;
  background: url("/icon/all-works.svg") no-repeat -33px -41px;
  width: 80px;
  height: 97px;
  right: 0;
  cursor: pointer;
  margin-right: 5%;
  transition: filter 0.3s ease;
}
.dark-mode .all-work {
  background: url("/icon/all-works.svg") no-repeat -179px -41px;
  width: 80px;
  height: 97px;
}
.all-work:hover {
  filter: brightness(1.2);
}

.dark-mode .work-pop {
  background: rgb(0 0 0);
  box-shadow: 0px 4px 45.8px 49px rgb(0 0 0 / 25%);
}
.dark-mode .work-pop .work-pop-des-box p {
  color: white;
}
.dark-mode .work-pop-title {
  color: white;
}
.dark-mode .work-pop .work-pop-des-box img {
  opacity: 0.8;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

main {
  overflow-y: auto !important;
  height: 100vh;
}
.des-box {
  img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    cursor: grab;
  }
}

.dark-mode .des-box {
  img {
    filter: brightness(70%);
  }
}

@keyframes slideInBlack {
  0% {
    background-position-x: 100%;
  }
  100% {
    background-position-x: 0%;
  }
}

@keyframes slideOutWhite {
  0% {
    background-position-x: 0%;
  }
  100% {
    background-position-x: 100%;
  }
}

.des-title-layout {
  position: absolute;
  background: #fff;
  bottom: 0;
  z-index: 100 !important;
  width: 100%;
  cursor: pointer;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, #ffffff 50%, #000000 50%);
  background-size: 200% 100%;
  transition: none;
  animation-duration: 0.2s;
  animation-timing-function: ease;
  .des-title {
    width: 80%;
    display: flex;
    font-size: 22px;
    font-weight: bold;
    p {
      padding: 0;
      margin: 0;
      color: #00e0ff;
      margin-right: 1vw;
    }
    span {
      color: #000000;
    }
  }
  .des-more {
    color: #c5c5c5;
    font-weight: bold;
  }
}
.dark-mode .des-title-layout {
  background-image: linear-gradient(to left, #ffffff 50%, #000000 50%);
  .des-title {
    p {
      color: #00e0ff;
    }
    span {
      color: white;
    }
  }
}

.dark-mode .des-title-layout:hover {
  background-image: linear-gradient(to right, #ffffff 50%, #000000 50%);
  .des-title {
    p {
      padding: 0;
      margin: 0;
      color: #00e0ff;
      margin-right: 1vw;
    }
    span {
      color: #000000;
    }
  }
}
.des-title-layout:hover {
  background-image: linear-gradient(to left, #ffffff 50%, #000000 50%);
  animation-name: slideInBlack;
  .des-title {
    p {
      color: #00e0ff;
    }
    span {
      color: white;
    }
  }
}

.des-title-layout:not(:hover) {
  animation-name: slideOutWhite;
  animation-direction: reverse;
}
</style>
