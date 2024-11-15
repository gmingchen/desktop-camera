
<template>
  <div class="shape" :class="type" :style="style">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: () => ''
  },
  size: {
    type: String,
    default: () => '100%'
  }
})

const style = computed(() => ({
  width: props.size,
  height: props.size
}))
</script>

<style lang="scss" scoped>
.shape {
  position: relative;
  overflow: hidden;
  &.circle {
    clip-path: circle();
  }
  &.quadrilateral {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  &.pentagon {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
  &.hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  &.heptagon {
    clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
  }
}
</style>
