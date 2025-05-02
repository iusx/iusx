<script setup lang="ts">
import { onMounted } from "vue";
import Lenis from "@studio-freight/lenis";
const colorMode = useColorMode();

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ritsu` : 'ritsu';
  }
})

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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import "/public/scss/app.scss";

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
</style>
