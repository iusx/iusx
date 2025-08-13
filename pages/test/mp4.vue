<template>
  <div class="test" @click="startPlay">
    <h1>Mp4 test 12</h1>
    <video ref="video" poster="/test/poster.jpg" muted playsinline webkit-playsinline autoplay preload="metadata"></video>
    <pre>{{ playerInfo }}</pre>
  </div>
</template>

<script setup>
import Hls from "hls.js";
import { ref } from "vue";

const video = ref(null);
const playerInfo = ref({});

function startPlay() {
  const hls = new Hls();
  hls.loadSource("/test/playlist.m3u8");
  hls.attachMedia(video.value);
  video.value.play().catch(err => console.warn("Play blocked:", err));
}

function detectPlayerSupport() {
  const video = document.createElement("video");

  const support = {
    userAgent: navigator.userAgent,
    hlsNative: video.canPlayType("application/vnd.apple.mpegurl") !== "",
    mp4: video.canPlayType("video/mp4") !== "",
    webm: video.canPlayType("video/webm") !== "",
    ogg: video.canPlayType("video/ogg") !== "",
    hlsJsSupport: Hls.isSupported(),
    autoplayInline: false,
    playsinline: "playsInline" in video,
    mutedAutoplay: false,
  };

  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        support.autoplayInline = true;
        support.mutedAutoplay = true;
      })
      .catch(() => {
        support.autoplayInline = false;
        support.mutedAutoplay = false;
      });
  }

  return support;
}

onMounted(() => {
  playerInfo.value = detectPlayerSupport();
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
