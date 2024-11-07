<template>
  <div class="camera">camera</div>
</template>

<script setup>
import { useStore } from '@store'
const store = useStore()

console.log(store.counter)
</script>

<style scoped>
.camera {
}
</style>
