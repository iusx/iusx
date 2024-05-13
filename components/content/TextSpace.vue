<script setup lang="ts">
import { defineProps, onMounted } from "vue";

defineProps(["info", "img", "type"]);

const direction = ref<"row" | "row-reverse">("row");

onMounted(() => {
  direction.value = Math.random() > 0.5 ? "row" : "row-reverse";
});
</script>

<template>
  <main>
    <a :href="'/img/' + img" target="_blank" v-if="type === 'flat'">
      <main
        class="layout"
        v-if="info"
        :class="{
          'page-tips-main': true,
          'reverse-direction': direction === 'row-reverse',
        }"
      >
        <img class="img" v-if="img" alt="text-desc" :src="'/img/' + img" />
        <div v-html="info"></div></main
    ></a>
    <main
      v-else
      class="layout"
      v-if="info"
      :class="{
        'page-tips-main': true,
        'reverse-direction': direction === 'row-reverse',
      }"
    >
      <page-image class="img" :img="img" />
      <div v-html="info"></div>
    </main>
  </main>
  <main class="tip" v-if="type == 'tip'">
    <Icon class="tip-quto" name="QutoIcon" size="20" /><slot> </slot>
  </main>
</template>

<style lang="scss" scoped>
.tip {
  padding: 1vh;
  margin-top: 1.2vh;
  margin-bottom: 1.2vh;
  background: #fafafa;
  .tip-quto {
    opacity: 0.1;
  }
}
.page-tips-main {
  color: #c0c0c0;
  font-size: 1vh;
  display: flex;
  &.reverse-direction {
    flex-direction: row-reverse;
  }
  .img {
    width: 70%;
    height: 70%;
    padding: 7px;
  }
}
.layout {
  text-align: left;
}
a {
  text-decoration: none;
  &:hover {
    opacity: 0.7;
  }
}
</style>
