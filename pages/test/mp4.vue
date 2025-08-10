
<template>
  <div class="test">
    <p>Mp4 test 11</p>
    <div v-if="!started" class="poster" @click="startVideo">
      <img src="/test/poster.jpg" alt="poster" />
      <div class="play-btn">▶</div>
    </div>
    <video
      v-show="started"
      id="video"
      muted
      playsinline
      webkit-playsinline
      loop
    ></video>
  </div>
</template>

<script setup>
import Hls from "hls.js";
import { ref } from "vue";

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
</script>

<style lang="scss">
.test {
  height: 300vh;
  width: 100%;

  .poster {
    position: relative;
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
    .play-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 40px;
      color: white;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      padding: 10px;
    }
  }

  video {
    width: 100%;
  }
}
</style>
