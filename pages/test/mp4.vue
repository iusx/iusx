<template>
  <div class="test">
    <p>Mp4 test</p>

    <video id="video" muted playsinline webkit-playsinline autoplay></video>
  </div>
</template>

<script setup>
import Hls from "hls.js";

onMounted(() => {
  const video = document.getElementById("video");
  const hls = new Hls();
  hls.loadSource("/test/playlist.m3u8");
  hls.attachMedia(video);
});
</script>

<style lang="scss">
.test {
  height: 300vh;
  width: 100%;
  video {
    &::-webkit-media-controls {
      display: none !important;
    }
    &::-webkit-media-controls-enclosure {
      display: none !important;
    }
    width: 100%;
  }
}
</style>
