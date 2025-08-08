<template>
  <ContentDoc :path="path">
    <template #not-found>
      <error />
    </template>
  </ContentDoc>
</template>

<script setup lang="ts">
const slug = useRoute().params.slug;

import error from '../error.vue';
</script>

<style lang="scss">
p a {
  color: rgb(152, 152, 152);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #38E7CD;
  }
}
</style>
