<template>
  <main>
  </main>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  setTimeout(() => {
    window.location.href = '/'
  }, 1000);
});

</script>
