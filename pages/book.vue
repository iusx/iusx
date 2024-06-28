<script setup>
const { data: equalQueryBook } = await useAsyncData("equalBook", () => {
  return queryContent("book/").find();
});

const colorMode = useColorMode();

useSeoMeta({
  title: "Bookshelf - RHYME.Q",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

if (equalQueryBook.value) {
  equalQueryBook.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}
const sortedData = computed(() => equalQueryBook.value);
</script>
<template>
  <main>
    <div class="note-layout">
      <div class="note-des">
        <a href="/"><img src="/icon/logo.svg" alt="logo" class="logo" /></a>
        <p class="title">
          the My note<br />
          Collector
        </p>
        <div class="title-hr"></div>
        <div class="title-desc-about">
          <p>
            A few years ago, I was very passionate about applied technology.
            However, now I want to delve into the underlying principles and
            fundamentals as they form the foundation upon which new technologies
            are built. These principles remain relevant and enduring despite the
            rapid advancements in technology.
          </p>
          <div class="title-desc-tip">
            <img src="/icon/info-tip.svg" />
            After reading this information, I will organize my knowledge into
            shorthand notes, indicating their purpose and even their application
            scenarios. In the future, when needed, I will conduct in-depth
            learning.
          </div>
        </div>
      </div>
      <div class="note-book">
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
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
a {
  color: white;
  text-decoration: none;
}
.scale-effect {
  @media (max-width: 1440px) {
    transform: scale(1);
  }
  transform: scale(0.94);
}
.note-layout {
  display: flex;
  width: 85%;
  margin: 0 auto;
  @media (max-width: 1521px) {
    display: flex;
    width: 85%;
    margin: 0 auto;
    flex-direction: column;
    flex-wrap: nowrap;
  }
}
main {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.logo {
  width: 49px;
  padding-top: 1vw;
  cursor: pointer;
}

.dark-mode .title {
  color: white !important;
}
.note-des {
  flex: 1.5;
  position: sticky;
  top: 10px;
  height: 51vw;
  z-index: -30;
  @media (max-width: 1668px) {
    flex: 1.2;
  }
  .title {
    color: #000;
    font-size: 5vw;
    font-weight: bold;
    text-transform: capitalize;
    padding: 0;
    margin-bottom: 4vh;
    margin-top: 10vw;
  }
  .title-hr {
    background: #0054f8;
    width: 300px;
    height: 3px;
    display: block;
  }
  .title-desc-about {
    font-size: 0.8vw;
    color: #c0c0c0;
    line-height: 1.5;
    text-align: justify;
    margin-top: 3vw;
    .title-desc-tip {
      margin-top: 2vw;
      display: flex;
      img {
        margin-right: 1vw;
      }
      align-items: flex-start;
    }
  }
}

.dark-mode .title-desc-about {
  opacity: 0.6;
}

.dark-mode .note-book-box {
  opacity: 0.5;
}

.note-book {
  display: flex;
  width: 100%;
  flex: 2;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  @media (max-width: 1521px) {
    display: flex;
    width: 100%;
    margin-top: 3vw;
    flex-wrap: wrap;
    justify-content: space-between;
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
}
</style>
