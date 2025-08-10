<template>
  <p>Mp4 test 3</p>
  <div class="test">
    <video muted="" playsinline="" src="/test/test.mp4"></video>
  </div>
</template>

<script setup></script>

<style lang="scss">
.test {
  height: 200vh;
  width: 100%;
  video {
    width: 100%;

    -webkit-media-controls {
      display: none !important;
    }

    -webkit-media-controls-play-button {
      display: none !important;
    }

    -webkit-media-controls-timeline {
      display: none !important;
    }

    -webkit-media-controls-mute-button,
    -webkit-media-controls-volume-slider {
      display: none !important;
    }

    -webkit-media-controls-fullscreen-button {
      display: none !important;
    }

    -webkit-media-controls-current-time-display,
    -webkit-media-controls-time-remaining-display {
      display: none !important;
    }

    -webkit-media-controls-toggle-closed-captions-button {
      display: none !important;
    }

    &::-webkit-media-controls-panel {
      display: none !important;
    }

    &::-webkit-media-controls-enclosure {
      display: none !important;
    }

    pointer-events: none;
  }
}
</style>
