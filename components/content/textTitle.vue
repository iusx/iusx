<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

defineProps(["t", "type"]);
</script>

<template>
  <main>
    <p class="title">{{ t }}</p>
  </main>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1.3vw !important;
  color: #3f3f3f;
}
.dark-mode .title {
    color: white;
}
</style>
