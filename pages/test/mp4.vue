<template>
  <div class="main">
    <p>Mp4 test 4</p>
    <div class="test" ref="videoCanvas"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const videoCanvas = ref(null);

onMounted(() => {
  if (videoCanvas.value) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const video = document.createElement("video");

    video.src = "/test/test.mp4";
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => {
      canvas.width = videoCanvas.value.clientWidth;
      canvas.height = videoCanvas.value.clientHeight;
      videoCanvas.value.appendChild(canvas);
      drawFrame();
    });

    function drawFrame() {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    }

    video.play();
  }
});
</script>

<style lang="scss">
.main {
  width: 100%;
  height: 300vh;

  .test {
    width: 500px;
    height: 400px;
    border: 1px solid red;
    overflow: hidden;
  }
}
</style>
