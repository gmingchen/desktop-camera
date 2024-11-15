<template>
  <Shape :type="types[typeActive]">
    <video ref="refVideo" :style="style"></video>
    <Loading v-show="loading"></Loading>
    <div v-show="!loading && errorMessage" class="error">{{ errorMessage }}</div>
  </Shape>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import Shape from '@components/shape/index.vue'
import Loading from '@components/loading/index.vue'

const { ipcRenderer } = window.electron

const scale = ref(1)
ipcRenderer.on('Alt+CommandOrControl+Shift+Q', () => {
  if (scale.value < 10) {
    scale.value += 0.01
  }
})
ipcRenderer.on('Alt+CommandOrControl+Shift+W', () => {
  if (scale.value > 1) {
    scale.value -= 0.01
  }
})

const types = ['', 'circle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon']
const typeActive = ref(0)
ipcRenderer.on('Alt+CommandOrControl+Shift+A', () => {
  typeActive.value = typeActive.value ? typeActive.value - 1 : types.length - 1
})
ipcRenderer.on('Alt+CommandOrControl+Shift+S', () => {
  typeActive.value = typeActive.value < types.length - 1 ? typeActive.value + 1 : 0
})

const loading = ref(true)
const style = computed(() => {
  const result = {
    transform: `scale(${scale.value})`,
    'background-color': loading.value || errorMessage ? '#282828' : 'transparent'
  }
  return result
})

const errors = {
  NotFoundError: '未发现可用设备',
  NotReadableError: '设备已被占用',
  NotAllowedError: '无访问设备权限',
  OtherError: '无法访问设备'
}
const errorMessage = ref('')

const refVideo = ref()
const getVideo = () => {
  const constraints = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 1280 }
    }
  }
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (!hasVideo(stream)) {
        errorMessage.value = errors.NotAllowedError
        return
      }

      errorMessage.value = ''

      refVideo.value.srcObject = stream
      refVideo.value.play()
      refVideo.value.addEventListener('loadedmetadata', () => {
        loading.value = false
      })
    })
    .catch((error) => {
      const { name } = error
      errorMessage.value = errors[name] || errors.OtherError
      loading.value = false
    })
}

const hasVideo = (stream) => {
  return stream.getTracks().some(({ kind, label }) => {
    return kind === 'video' && !label.endsWith('Virtual Camera')
  })
}

onMounted(() => {
  getVideo()
})
</script>

<style lang="scss" scoped>
video {
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
}
.error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
