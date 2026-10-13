<template>
  <div :class="{ 'article-page': route.path !== '/' }">
    <ContentDoc :key="route.path" :path="route.path">
      <template #not-found>
        <error />
      </template>
    </ContentDoc>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

import error from '../error.vue';
</script>

<style lang="scss">
@import "../public/scss/article.scss";
</style>
