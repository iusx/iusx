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
  <div id="app">
    <an-more />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@import "/public/scss/app.scss";
</style>
