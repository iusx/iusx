<template>
  <main>
    <img :src="imagePath" :alt="altText" />
    <p v-html="text">

    </p>
  </main>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  text: {
    type: String
  }
});

const imagePath = computed(() => `/img/book/${props.url}`);

const altText = computed(() => (props.url ? `Book image for ${props.url}` : 'Default book image'));
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;

  margin-top: 15px;
  margin-bottom: 15px;

  img {
    width: 50%;
  }
}
</style>
