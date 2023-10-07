<script setup>
import { defineEmits, defineProps, onMounted, onUnmounted, ref } from 'vue'
import zoom from './zoom.js'

const props = defineProps({
  width: { type: Number, default: window.innerWidth },
  height: { type: Number, default: window.innerHeight }
})
const emits = defineEmits(['shutterClick', 'done'])

const width = props.width
const height = props.height
const widthPx = `${width}px`
const heightPx = `${height}px`
const video = ref()
const canvas = ref()
const srcDataURL = ref()
const showOutput = ref(false)

function getScreenOrientation() {
  if (window.innerHeight > window.innerWidth) {
    return 'portrait'
  } else {
    return 'landscape'
  }
}

function startup() {
  let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
  if (!orientation) {
    orientation = getScreenOrientation()
  }
  let aspectRatio = width / height
  if (orientation?.includes('portrait')) {
    aspectRatio = height / width
  }
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: 'environment',
        aspectRatio: aspectRatio
      },
      audio: false,
      resizeMode: true
    })
    .then((stream) => {
      video.value.srcObject = stream
      video.value.play()
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`)
    })
}

function takePicture() {
  video.value.pause()

  const devicePixelRatio = window.devicePixelRatio
  canvas.value.width = width * devicePixelRatio
  canvas.value.height = height * devicePixelRatio
  const context = canvas.value.getContext('2d')
  context.scale(devicePixelRatio, devicePixelRatio)
  context.imageSmoothingQuality = 'high'

  let x = z.drawX
  let y = z.drawY
  let scale = video.value.videoWidth / width

  context.drawImage(
    video.value,
    x * scale,
    y * scale,
    video.value.videoWidth / z.scale,
    video.value.videoHeight / z.scale,
    0,
    0,
    width,
    height
  )

  srcDataURL.value = canvas.value.toDataURL('image/jpeg')
  showOutput.value = true
  emits('shutterClick')
}

function castoff() {
  video.value.play()
  showOutput.value = false
}

function done() {
  stopTrack()
  emits('done', srcDataURL.value)
}

function stopTrack() {
  for (let track of video?.value?.srcObject.getTracks() ?? []) {
    track.stop()
  }
}

function orientationChange() {
  startup()
}

const z = new zoom()
onMounted(() => {
  startup()
  z.zoomElement(video.value)
  window.addEventListener('orientationchange', orientationChange)
})
onUnmounted(() => {
  stopTrack()
  window.removeEventListener('orientationchange', orientationChange)
})
</script>

<template>
  <div class="content-area">
    <div v-show="!showOutput" class="camera">
      <video id="video" ref="video" playsinline webkit-playsinline="true">视频流目前不可用。</video>
      <button id="start-button" @click.prevent="takePicture">拍摄照片</button>
    </div>
    <canvas id="canvas" ref="canvas"></canvas>
    <div v-show="showOutput" class="output">
      <img id="photo" ref="photo" :src="srcDataURL" alt="拍摄的照片" />
      <div class="action-output">
        <button id="castoff" @click.prevent="castoff">重拍</button>
        <button id="done" @click.prevent="done">完成</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-area {
  width: v-bind(widthPx);
  height: v-bind(heightPx);
  font-size: 16px;
  font-family: 'Lucida Grande', 'Arial', sans-serif;
  background-color: #0e0e0e;
}

.camera,
.output {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}

#video,
#canvas,
#photo {
  width: v-bind(widthPx);
  height: v-bind(heightPx);
}

#video {
  transform-origin: 0 0;
}

#canvas {
  display: none;
}

#start-button,
.action-output {
  position: absolute;
}

.action-output {
  width: v-bind(widthPx);
  display: flex;
  justify-content: space-around;
}

#start-button,
#castoff,
#done {
  width: 100px;
  height: 40px;
  margin-bottom: 18px;
  background-color: rgba(0, 150, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-family: 'Lucida Grande', 'Arial', sans-serif;
  color: rgba(255, 255, 255, 1);
}
</style>
