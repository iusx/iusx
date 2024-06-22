<template>
  <main ref="el" :style="style">
    <a
      href="/"
      :class="{ active: currentPage === '/' || currentPage === '/about' }"
    >
      <Icon name="RhymeIcon" size="2.8vh"
    /></a>
    <a href="/dev" :class="{ active: currentPage.startsWith('/dev') }">
      <Icon name="DevIcon" size="2.8vh"
    /></a>
    <a href="/des" :class="{ active: currentPage.startsWith('/des') }"
      ><Icon name="DesIcon" size="2.8vh"
    /></a>
    <a href="/sec" :class="{ active: currentPage.startsWith('/sec') }"
      ><Icon name="SecIcon" size="2.8vh"
    /></a>
    <a href="/book" :class="{ active: currentPage.startsWith('/book') }"
      ><Icon name="BookIcon" size="2.8vh"
    /></a>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDraggable } from "@vueuse/core";

const el = ref<HTMLElement | null>(null);

const currentPage = ref<string>("");

onMounted(() => {
  currentPage.value = window.location.pathname;
});

const { x, y, style } = useDraggable(el, {
  initialValue: { x1: 0, y: 300 },
});
</script>

<style lang="scss" scoped>
main {
  position: fixed;
  top: 50%;
  background: #000;
  color: white;
  cursor: pointer;
  z-index: 11;
  width: fit-content;
  right: 0;
  background-repeat: no-repeat;
  background-image: url(/img/page/drag.png);
  background-size: 1.3vh;
}
a {
  display: block;
  text-decoration: none;
  color: white;
  margin: 1vh;
  font-size: small;
  filter: brightness(4);
  opacity: 0.5;
  transition: filter 0.3s ease, opacity 0.3s ease;
  &:hover {
    filter: brightness(1);
    opacity: 1;
  }
}
.active {
  filter: brightness(1);
  opacity: 1;
}
</style>
