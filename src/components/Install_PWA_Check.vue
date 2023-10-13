<script setup>
import { ref } from 'vue'

const installedApp = ref(true)
let installPrompt
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  installPrompt = event
  installedApp.value = false
})
window.addEventListener('appinstalled', () => {
  installPrompt = null
  installedApp.value = true
})

function installApp() {
  if (!installPrompt) {
    return
  }
  installPrompt.prompt().then((value) => {
    if (value.outcome === 'accepted') {
      installedApp.value = true
    }
    installPrompt = null
  })
}
</script>

<template>
  <div v-show="!installedApp" class="install-tip">
    <span>即刻安装应用(PWA)，使用离线功能</span>
    <button @click="installApp">安 装</button>
  </div>
</template>

<style scoped lang="scss">
.install-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
}
</style>
