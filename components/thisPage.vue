<template>
  <p class="about">
    <a href="/"><small>Home /</small><slot /></a>
  </p>
</template>

<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();
defineProps(["page"]);
</script>

<style lang="scss" scoped>
.about {
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: x-large;
  text-transform: uppercase;
  position: relative;
  display: inline-block;

  &::after {
    content: "→";
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%) translateX(-5px);
    opacity: 0;
    color: rgb(215 215 215);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  small {
    color: #a2a2a2;
    font-size: initial;
    padding-right: 10px;
  }
}
</style>
