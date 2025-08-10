<template>
  <div class="test">
    <h1>Mp4 test 11</h1>
    <div v-if="!started" class="poster" @click="startVideo">
      <img src="/test/poster.jpg" alt="poster" />
      <div class="play-btn">▶</div>
    </div>
    <video v-show="started" id="video" muted playsinline webkit-playsinline autoplay></video>
    <pre>{{ playerInfo }}</pre>
  </div>
</template>

<script setup>
import Hls from "hls.js";
import { onMounted, ref } from "vue";

const playerInfo = ref({});
const started = ref(false);

function startVideo() {
  started.value = true;
  const video = document.getElementById("video");

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource("/test/playlist.m3u8");
    hls.attachMedia(video);
    video.play();
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = "/test/playlist.m3u8";
    video.play();
  }
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

setTimeout(() => {
  video.play().catch(() => {});
}, 500);
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
