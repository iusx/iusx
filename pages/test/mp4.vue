<template>
  <div class="test">
    <p>Mp4 test 2</p>
    <video
      class="video"
      muted
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      preload="none"
      crossorigin="anonymous"
      data-src="/test/test.mp4"  
      aria-label="动画演示..."
    ></video>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const video = document.querySelector('.video');
  if(video) {

    setTimeout(() => {
      video.src = video.getAttribute('data-src');
    }, 500);

    video.load();
  }
});
</script>
