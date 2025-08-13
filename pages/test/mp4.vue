<template>
  <div class="test">
    <h1>Mp4 test 14</h1>
    <video
      id="video"
      muted
      playsinline
      webkit-playsinline
      autoplay
      src="/test/test.mp4"
    ></video>
    <pre>{{ JSON.stringify(playerInfo, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const playerInfo = ref({})

onMounted(async () => {
  const video = document.getElementById('video')

  playerInfo.value.browser = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
  }
  playerInfo.value.page = {
    url: location.href,
    protocol: location.protocol,
    referrer: document.referrer,
  }

  playerInfo.value.videoSupport = {
    mp4: video.canPlayType('video/mp4'),
    webm: video.canPlayType('video/webm'),
    ogg: video.canPlayType('video/ogg'),
  }

  const updateVideoStatus = () => {
    playerInfo.value.videoState = {
      networkState: video.networkState, 
      readyState: video.readyState, 
      paused: video.paused,
      ended: video.ended,
      muted: video.muted,
      currentTime: video.currentTime,
      duration: video.duration,
      buffered: video.buffered.length
        ? `${video.buffered.start(0).toFixed(2)}-${video.buffered.end(0).toFixed(2)}`
        : 'none',
    }
  }

  const events = [
    'loadstart',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'play',
    'playing',
    'pause',
    'ended',
    'error',
    'waiting',
    'stalled',
    'suspend',
    'timeupdate',
  ]
  events.forEach(evt => {
    video.addEventListener(evt, () => {
      updateVideoStatus()
      playerInfo.value.lastEvent = evt
    })
  })

  updateVideoStatus()

  try {
    const resp = await fetch(video.src, { method: 'HEAD' })
    playerInfo.value.videoHeaders = {}
    for (const [key, value] of resp.headers.entries()) {
      playerInfo.value.videoHeaders[key] = value
    }
  } catch (e) {
    playerInfo.value.videoHeaders = { error: e.message }
  }
})
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
