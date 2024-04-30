<template>
  <main>
    <a
      href="/"
      :class="{ active: currentPage === '/' || currentPage === '/about' }"
    >
      <Icon name="RhymeIcon" size="30"
    /></a>
    <a href="/dev" :class="{ active: currentPage.startsWith('/dev') }">
      <Icon name="DevIcon" size="30"
    /></a>
    <a href="#" :class="{ active: currentPage.startsWith('/des') }"
      ><Icon name="DesIcon" size="30"
    /></a>
    <a href="/sec" :class="{ active: currentPage.startsWith('/sec') }"
      ><Icon name="SecIcon" size="30"
    /></a>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const currentPage = ref<string>("");

onMounted(() => {
  currentPage.value = window.location.pathname;
});
</script>

<style lang="scss" scoped>
main {
  position: fixed;
  top: 50%;
  background: #000;
  color: white;
  z-index: 11;
  right: 0;
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
