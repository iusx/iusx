<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

defineProps(["t", "type"]);
</script>

<template>
  <div class="text-title-color">
    <main v-if="type == 2">
      <p class="h2">{{ t }}</p>
    </main>
    <main v-else>
      <p class="title">{{ t }}</p>
    </main>
  </div>
</template>

<style lang="scss" scoped>

.text-title-color p {
  color: #3f3f3f !important;
  z-index: -1;
  position: relative;
}

.title {
  font-size: 20px !important;
}

.h2 {
  font-size: 17px;
  opacity: 0.8;
}

.dark-mode .text-title-color p {
  color: white !important;
}
</style>
