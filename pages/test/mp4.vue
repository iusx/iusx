<template>
  <div class="main">
    <p>Mp4 test 4</p>
    <div class="test" ref="videoCanvas"></div>
    <button @click="initVideo" v-if="showFallback">click</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const videoCanvas = ref(null);
const showFallback = ref(false);

const initVideo = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const video = document.createElement("video");

  video.src = "/test/test.mp4";
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.addEventListener("loadedmetadata", () => {
    canvas.width = videoCanvas.value.clientWidth;
    canvas.height = videoCanvas.value.clientHeight;
    videoCanvas.value.innerHTML = "";
    videoCanvas.value.appendChild(canvas);
    drawFrame();
  });

  video.play().catch(e => {
    alert("NO:", e);
    showFallback.value = true;
  });

  function drawFrame() {
    if (!ctx || video.paused || video.ended) return;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    } catch (e) {
      alert("no", e);
      showFallback.value = true;
    }
  }
};

onMounted(() => {
  if (!videoCanvas.value) return;
  initVideo();
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

  button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 4px;
  }
}
</style>
