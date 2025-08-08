<template>
  <main
    ref="el"
    :style="style"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <a
      href="/"
      :class="{ active: currentPage === '/' || currentPage === '/about' }"
    >
      <Icon name="RhymeIcon" size="30px" />
    </a>
    <a href="/des" :class="{ active: currentPage.startsWith('/des') }">
      <Icon name="DesIcon" size="30px" />
    </a>
    <a href="/sec" :class="{ active: currentPage.startsWith('/sec') }">
      <Icon name="SecIcon" size="30px" />
    </a>
    <a href="/book" :class="{ active: currentPage.startsWith('/book') }">
      <Icon name="BookIcon" size="30px" />
    </a>
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

const handleMouseEnter = () => {
  el.value!.style.transition = "right 0.3s ease-in-out";
  el.value!.style.right = "0px";
};

const handleMouseLeave = () => {
  el.value!.style.transition = "right 0.3s ease-in-out";
  el.value!.style.right = "-40px";
};
</script>

<style lang="scss" scoped>
main {
  position: fixed;
  top: 30% !important;
  color: white;
  cursor: pointer;
  z-index: 11;
  width: fit-content;
  right: 0;
  border-left: 3px solid #38E7CD;
  box-shadow: -1px 0px 0px 0px #38E7CD;
  background-repeat: no-repeat;
  background-image: url(/img/page/drag.png);
  background: #000;
}


a {
  display: block;
  text-decoration: none;
  color: white;
  margin: 10px;
  font-size: small;
  opacity: 0.5;
  transition: filter 0.3s ease, opacity 0.3s ease;
  filter: grayscale(100%);

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
