<template>
  <div class="test">
    <video
      v-if="videoUrl"
      :src="videoUrl"
      muted
      autoplay
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
      poster="/test/poster.jpg"
    ></video>
  </div>
</template>

<script setup>
const videoUrl = ref('')

onMounted(async () => {
  const res = await $fetch('/api/video-sign')
  videoUrl.value = res.url
})
</script>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
video::-webkit-media-controls-enclosure {
  display: none !important;
}
video {
  width: 100%;
}
</style>
