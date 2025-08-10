<template>
  <div class="test">
    <p>Mp4 test</p>
    <video
      id="video"
      muted
      autoplay
      playsinline
      webkit-playsinline
      loop
    ></video>
  </div>
</template>

<script setup>
import Hls from "hls.js";
import { onMounted } from "vue";

onMounted(() => {
  const video = document.getElementById("video");
  const token = btoa(Date.now() + "secret_key");
  const url = `/test/playlist.m3u8?token=${token}`;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    video.play().catch(err => console.warn("Autoplay blocked:", err));
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.play().catch(err => console.warn("Autoplay blocked:", err));
  }
});
</script>

<style lang="scss">
.test {
  height: 300vh;
  width: 100%;
  video {
    width: 100%;
    &::-webkit-media-controls {
      display: none !important;
    }
    &::-webkit-media-controls-enclosure {
      display: none !important;
    }
  }
}
</style>
