<script lang="ts" setup>
useSeoMeta({
  title: "Security - ritsu",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});
const colorMode = useColorMode();

const { data: equalQuerySec } = await useAsyncData("equal", () => {
  return queryContent("sec/").find();
});

if (equalQuerySec.value) {
  equalQuerySec.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}

const sortedData = computed(() => equalQuerySec.value);
</script>

<template>
  <main>
    <div class="main">
      <div class="main-title">
        <p>My Vulnerability</p>
        <an-typing> Report </an-typing>
        <span>SECURITY</span>
        <Icon class="red" name="RedIcon" />
      </div>
      <div class="content-layout">
        <p class="title-desc">
          Although I'm not officially in the security biz, I've stumbled upon a
          few security hiccups in my<br />
          work or daily life and reported them, more or less.
        </p>
        <swiper :slides-per-view="'auto'">
          <swiper-slide v-for="sec in sortedData" class="content-box">
            <nuxt-link style="display: contents" :to="sec._path">
              <div class="content-time" style="height: 100%;">
                <img
                  :src="'/img/page/' + sec.platform + '.png'"
                  alt="report-platform"
                /><span>{{ sec.time.slice(0, 4) }}</span>
              </div>
              <p class="box-title">{{ sec.title }}</p>
            </nuxt-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

main {
  margin-left: 3vw !important;
}
.dark-mode {
  .content-layout {
    .content-box {
      border: 2px solid rgb(31, 31, 31) !important;
      .content-time {
        span {
          color: #1b1b1b;
        }
      }
      .box-title {
        color: #5d5d5d;
      }
    }
  }
  img {
    filter: brightness(5);
  }
  .main {
    .main-title {
      span {
        -webkit-text-stroke: 1px #2c2c2c;
      }
    }
  }
}
.content-layout {
  .content-box-layout {
    display: flex;
  }
  .content-box {
    height: 300px;
    width: 300px !important;
    background: transparent;
    border: 1px solid #dfe3e9;
    margin-right: 22px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: space-between;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      box-shadow 0.3s ease;
    &:hover {
      background: #181818;
      color: white;
      box-shadow: 0px 4px 64.5px 11px rgba(0, 0, 0, 0.26);
      .content-time {
        span {
          color: #3a3a3a;
        }
      }
      .box-title {
        border-bottom: 0px solid red;
      }
      img {
        filter: brightness(14);
      }
      .box-title {
        color: #fff;
      }
    }
    .content-time {
      display: flex;
      flex-direction: row;
      padding: 25px;

      justify-content: space-between;
      span {
        transition: color 0.3s ease;
        writing-mode: tb-rl;
        color: #f4f4f4;
        font-size: 3vh;
      }
    }
    img {
      width: 200px;
      height: 20px;
    }
    .box-title {
      border-bottom: 10px solid red;
      transition: border-bottom 0.3s ease;
      color: #000;
      margin: 0;
      padding: 25px;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 15px;
    }
  }
}
main {
  display: flex;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  position: fixed;
  .title-desc {
    color: #b5b5b5;
    margin-top: 40px;
    margin-bottom: 30px;
    font-size: 14px;
    width: 80vw;
  }
  @media (max-width: 768px) {
    padding-left: 5%;
    padding-right: 5%;
  }
}
.main {
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .main-title {
    p {
      font-size: 60px;
      color: #ef0000;
      font-weight: 600;
      z-index: 10;
      margin: 0;
      position: relative;
    }
    span {
      color: transparent;
      -webkit-text-stroke: 1px #dfdfdf;
      font-size: 330px;
      position: absolute;
      top: 0;
      z-index: 0;
    }
    .red {
      position: absolute;
      right: 3vw;
    }
  }
}
.title {
  width: 40vw !important;
}
.left {
  text-transform: uppercase;
  padding: 20px;
  writing-mode: tb-rl;
  padding-right: 5vw;
  font-weight: bold;
  color: #b5b5b5;
  margin-right: 5vw;
  background: #f5f5f5;
  height: 100vh;
  letter-spacing: 3.28px;
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
