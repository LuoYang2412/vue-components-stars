import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户位置
export const useGeolocationDataStore = defineStore('useGeolocationDataStore', () => {
  const geolocationData = ref()

  function checkGeolocation() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        console.log('已授予位置权限')
      } else {
        console.log('未授予位置权限')
        console.log('使用位置功能，需授予定位权限')
      }
    })
    if ('geolocation' in navigator) {
      return true
    } else {
      console.log('地理位置服务不可用')
      return false
    }
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 1000
  }

  function successCallback(position) {
    // console.log("获取位置", position);
    geolocationData.value = position
  }

  let showErrorCD = 0

  // 位置错误处理
  function errorCallback(error) {
    // alert(`ERROR(${error.code}): ${error.message}`);
    let msg = '获取位置失败，'
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        msg = msg.concat('没有权限。')
        break
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        msg = msg.concat('内部错误。')
        break
      case GeolocationPositionError.TIMEOUT:
        msg = msg.concat('响应超时。')
        break
      default:
        msg = msg.concat('未知原因。')
    }
    if (showErrorCD === 0) {
      console.log(msg)
      // 设置10秒cd
      showErrorCD = 10 * 1000
    }
    setTimeout(() => {
      showErrorCD = 0
    }, showErrorCD)
  }

  function getMeCurrentPosition() {
    if (checkGeolocation()) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
    }
  }

  let watchMePositionId

  function watchMePosition() {
    if (!watchMePositionId) {
      if (checkGeolocation()) {
        watchMePositionId = navigator.geolocation.watchPosition(
          successCallback,
          errorCallback,
          options
        )
      }
    }
  }

  function clearWatchMePosition() {
    navigator.geolocation.clearWatch(watchMePositionId)
    watchMePositionId = undefined
  }

  return {
    geolocationData,
    getMeCurrentPosition,
    watchMePosition,
    clearWatchMePosition
  }
})
