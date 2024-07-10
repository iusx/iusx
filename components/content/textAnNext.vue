<template>
  <main></main>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const hasUrl = ref(false);

onMounted(() => {
  if (props.url) {
    hasUrl.value = true;
    window.location.href = props.url;
  } else {
    history.back();
  }
});

watch(
  () => props.url,
  (newUrl) => {
    if (newUrl && !hasUrl.value) {
      hasUrl.value = true;
      window.location.href = newUrl;
    }
  },
);
</script>
