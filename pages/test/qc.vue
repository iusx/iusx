<template>
  <div>
    <canvas ref="posterCanvas" :width="width" :height="height" style="display:none;"></canvas>
    <button @click="generateAndSavePoster">生成海报</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const width = 600
const height = 800
const posterCanvas = ref(null)

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

const generateAndSavePoster = async () => {
  const canvas = posterCanvas.value
  const ctx = canvas.getContext('2d')

  const bgImg = new Image()
  bgImg.crossOrigin = 'anonymous' 
  bgImg.src = '/logo.png'
  await new Promise(res => { bgImg.onload = res })
  ctx.drawImage(bgImg, 0, 0, width, height)

  const qrDataUrl = await QRCode.toDataURL(window.location.href, { width: 100 })
  const qrImg = new Image()
  qrImg.src = qrDataUrl
  await new Promise(res => { qrImg.onload = res })
  ctx.drawImage(qrImg, 20, height - 120, 100, 100)

  if (isMobile()) {

    const imgData = canvas.toDataURL('image/png')
    const w = window.open('')
    w.document.write(`<img src="${imgData}" style="width:100%">`)
  } else {

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'poster.png'
      a.click()
      URL.revokeObjectURL(url)
    })
  }
}
</script>
