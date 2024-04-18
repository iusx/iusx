<script setup lang="ts">
import { defineProps, onMounted } from "vue";

defineProps(["info", "img", "type"]);

const direction = ref<"row" | "row-reverse">("row");

onMounted(() => {
  direction.value = Math.random() > 0.5 ? "row" : "row-reverse";
});
</script>

<template>
  <a :href="'/img/' + img" target="_blank">
    <main
      v-if="info"
      :class="{
        'page-tips-main': true,
        'reverse-direction': direction === 'row-reverse',
      }"
    >
      <img v-if="img" :src="'/img/' + img" />
      <div v-html="info"></div></main
  ></a>
</template>

<style lang="scss" scoped>
.page-tips-main {
  color: #b6b6b6;
  font-size: small;
  display: flex;
  &.reverse-direction {
    flex-direction: row-reverse;
  }
  img {
    width: 50%;
    height: 50%;
  }
}
main {
  color: #8e8e8e;
  text-align: left;
}
div {
    padding: 10px;
}
a {
  text-decoration: none;
  &:hover {
    opacity: 0.7;
  }
}
</style>
