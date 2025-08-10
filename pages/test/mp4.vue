<template>
  <div class="test">
    <p>Mp4 test</p>
    <video muted playsinline ref="videoRef"></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const videoRef = ref(null)

onMounted(() => {
  const key = btoa('test/test.mp4' + Date.now())
  const realPath = '/test/test.mp4?token=' + key
  videoRef.value.src = realPath
})
</script>

<style lang="scss">
.test {
  height: 300vh;
  width: 100%;
  video {
    width: 100%;
  }
}
</style>
