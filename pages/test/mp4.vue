<template>
  <div class="test">
    <p>Mp4 test</p>

    <video id="video" muted="" playsinline=""></video>
  </div>
</template>

<script setup>
import Hls from 'hls.js'

onMounted(() => {
  const video = document.getElementById('video')
  const hls = new Hls()
  hls.loadSource('/test/playlist.m3u8')
  hls.attachMedia(video)
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
