<script setup lang="ts">
import { onMounted } from "vue";
import Lenis from "@studio-freight/lenis";
const colorMode = useColorMode();

onMounted(() => {
  const lenis: Lenis = new Lenis();
  if (typeof window !== "undefined") {
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});
</script>

<template>
  <div>
    <an-more />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
.dark-mode body {
  background: #000;
}
@font-face {
  font-family: "tsing";
  src: url("/tsing.ttf");
}
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  padding: 0;
  width: 100%;
  height: 100%;
}

.dark-mode .page-content,
.dark-mode .content img {
  filter: brightness(70%);
}

.text {
  p {
    font-size: 1.5vh;
    line-height: 1.6;
  }
}
.tips {
  z-index: 10;
}
.page-sec {
  .swiper-slide {
    height: 31vh !important;
    width: 31vh !important;
  }
}

.ref {
  a {
    text-decoration: none;
    text-transform: initial;
    color: #888888;
  }
}
.text h3 a {
  text-decoration: none;
  color: #000000;
}

.dark-mode .text h3 a {
  color: white;
}
.dark-mode .ref a {
  color: #a2a2a2 !important;
}

html::-webkit-scrollbar {
  width: 3px;
}

html::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

html::-webkit-scrollbar-thumb {
  background: #000000;
  border-radius: 25px;
}
.markdown-content h1 {
  display: flex;
  width: -moz-max-content;
  width: max-content;
  flex-direction: row-reverse;
  align-items: center;
  &::before {
    content: " ";
    display: block;
    width: 18px;
    height: 39px;
    background: #ffffff;
    margin-left: -18px;
  }
}
</style>
