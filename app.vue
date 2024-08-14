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
.main-con {
  table {
    width: 100% !important;
    thead {
      background: #f6f6f694;
    }
    tr th {
      padding: 0.7vw;
      text-align: inherit;
      font-weight: inherit;
      color: #888888;
      font-size: 1.6vh;
    }
    td {
      padding: 0.7vw;
      color: #888888;
      font-size: 1.5vh;
    }
  }
  tbody a {
    color: rgb(152, 152, 152);
    text-decoration: underline;
    transition: color 0.3s ease;
  }
  p a {
    text-decoration: underline;
  }
}
.dark-mode table {
  thead {
    background: #f6f6f612;
    color: #6d6d6d;
  }
  td {
    color: #8f8f8f;
  }
}
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
  width: 1px;
}

html::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

html::-webkit-scrollbar-thumb {
  background: #000000;
  border-radius: 25px;
}
.markdown-content h1 {
  font-size: 0;
  color: rgba(0, 0, 0, 0.189);
  text-transform: uppercase;
}
.markdown-content hr {
  margin: 10vh;
  border-color: #ffffff6b;
}
  .dark-mode .markdown-content hr {
    border-color: #6d6d6d80;
  }
.markdown-content {
  padding-top: 4vw;
  padding-bottom: 10vw;
  @media (max-width: 1024px) {
    padding-top: 10vw;
  }
}
.markdown-content pre code {
  color: #888888;
}
.dark-mode .markdown-content pre code {
  color: #404040;
}
.markdown-content p {
  display: block;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  color: #888888;
  font-size: 1.5vh;
  line-height: 1.6;
  margin-block: 1vw;
  text-align: justify;
  &:last-child {
    margin-bottom: 0vw;
  }
  @media (max-width: 1024px) {
    margin-block: 4vw;
  }
}
.dark-mode .markdown-content h1 {
  color: rgba(255, 255, 255, 0.588);
}
</style>
