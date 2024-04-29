<script setup lang="ts">
import { onMounted } from "vue";
import Lenis from "@studio-freight/lenis";

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
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  padding: 0;
  width: 100%;
  height: 100%;
}
div {
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 0;
}
.text {
  p {
    font-size: 1.5vh;
  }
}
</style>
