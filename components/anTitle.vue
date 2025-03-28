<script lang="ts" setup>
import { defineProps } from "vue";
const colorMode = useColorMode()

defineProps(["title", "url"]);
</script>
<template>
  <a :href="url" v-html="title"></a>
</template>

<style lang="scss" scoped>
@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.dark-mode a {
    color: rgb(255, 255, 255);
}

a {
  padding: 0;
  margin: 0;
  text-decoration: none;
  color: #1c0000;
  text-transform: capitalize;
  display: flex;
  letter-spacing: -2px;
  transition: color 0.3s ease;
  &:hover {
    color: #b7b7b7;
    text-decoration: none;
  }
}
a::before {
  content: "";
  display: block;
  height: 1vh;
  width: 1vh;
  background: #00dd82;
  border-radius: 120px;
  animation: fade 2s linear infinite;
  margin-top: 14px;
  margin-right: 2vh;
}
</style>
