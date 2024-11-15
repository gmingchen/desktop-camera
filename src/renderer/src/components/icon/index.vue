<template>
  <i class="iconfont" :style="style" :class="`icon-${name}`"></i>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: () => '14px'
  },
  color: {
    type: String,
    default: ''
  }
})

const style = computed(() => {
  return {
    'font-size': props.size,
    color: props.color
  }
})
</script>

<style lang="scss" scoped></style>
