<script setup lang="ts">
import { onMounted } from "vue";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const colorMode = useColorMode();

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ritsu` : "ritsu";
  },
});

onMounted(() => {
  const lenis = new Lenis({
    smooth: true,
    lerp: 0.1,
    duration: 1.2,
    autoRaf: false,
    allowNestedScroll: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});
</script>

<template>
  <div id="app">
    <div class="scanline"></div>

    <an-more />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import "/public/scss/app.scss";

@font-face {
  font-family: "Tsing";
  src:
    url("/Tsing.woff2") format("woff2"),
    url("/Tsing.woff") format("woff"),
    url("/Tsing.ttf") format("truetype");
}

@keyframes fadeIn {
  from {
    opacity: 0;
    visibility: hidden;
  }

  to {
    opacity: 1;
    visibility: visible;
  }
}

#app {
  opacity: 0;
  visibility: hidden;
  animation: fadeIn 2s 1s forwards;
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.03)
    );
  background-size:
    100% 4px,
    3px 100%;
  pointer-events: none;
  z-index: 100;
}

@media (prefers-color-scheme: light) {
  body,
  html {
    background: #f4f5f7;
  }
  .scanline {
    opacity: 0.3;
    background:
      linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 50%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02));
    background-size:
      100% 3px,
      3px 100%;
  }
}
</style>
