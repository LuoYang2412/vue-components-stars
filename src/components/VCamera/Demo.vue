<script setup>
import VCamera from '@/components/VCamera/VCamera.vue'
import { ref } from 'vue'

const showCamera = ref(false)

function onShutterClick() {
  // TODO 按下快门时
}

const image = ref()

function setImg(imgData) {
  image.value.setAttribute('src', imgData)
  showCamera.value = false
  addWatermarkFunction(imgData)
}
const markImg = ref()
function addWatermarkFunction(base64Data) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = base64Data
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.font = 'normal bold 50px sans-serif'
      ctx.fillStyle = 'rgba(255, 0, 0)'
      ctx.fillText('水印1', 0, img.height - 100)
      ctx.fillText('水印2', 0, img.height - 50)
      const watermarkedData = canvas.toDataURL('image/jpeg')
      resolve(watermarkedData)
    }
    img.onerror = (error) => {
      reject(error)
    }
  }).then((value) => {
    markImg.value.src = value
  })
}
</script>

<template>
  <div class="demo-box">
    <input id="takepicture" type="button" value="拍照" @click="showCamera = true" />
    <img
      v-show="!showCamera"
      style="width: 300px; height: 400px; display: block"
      src=""
      alt=""
      ref="image"
    />
    <VCamera
      v-if="showCamera"
      :width="300"
      :height="400"
      @shutterClick="onShutterClick"
      @done="setImg"
    />
    <img ref="markImg" style="width: 300px; height: 400px; margin-top: 20px" />
  </div>
</template>

<style scoped>
.demo-box {
  height: calc(844px - 46px) !important;
}
</style>
