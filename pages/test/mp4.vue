<template>
  <button class="PlayButton" aria-label="Play">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      role="presentation"
    >
      <path
        d="M6.24905 3.69194C5.82218 3.45967 5.30225 3.76868 5.30225 4.25466V15.7452C5.30225 16.2312 5.82218 16.5402 6.24906 16.3079L16.8079 10.5626C17.2538 10.32 17.2538 9.67983 16.8079 9.4372L6.24905 3.69194ZM4.021 4.25466C4.021 2.79672 5.58078 1.86969 6.86142 2.56651L17.4203 8.31176C18.758 9.03966 18.758 10.9602 17.4203 11.6881L6.86143 17.4333C5.58079 18.1301 4.021 17.2031 4.021 15.7452V4.25466Z"
        fill="currentColor"
      ></path>
    </svg>
  </button>
  <div class="test">
    <p>Mp4 test</p>
    <video
      muted=""
      playsinline=""
      src="/test/test.mp4"
      controlslist="nodownload"
      controls
    ></video>
  </div>
</template>

<script setup></script>

<style lang="scss">
.test {
  height: 200vh;
  width: 100%;
  video {
    width: 100%;
  }
}
</style>
