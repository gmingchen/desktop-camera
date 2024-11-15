<template>
  <div class="loading">
    <div v-for="item in 6" :key="item" class="circle"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@keyframes loading-animation {
  0%,
  100% {
    transform: rotate(360deg);
  }
}
@keyframes circle-animation {
  80%,
  100% {
    transform: rotate(360deg);
  }
}
@keyframes circle-before-animation {
  50% {
    transform: scale(0.4);
  }
  100%,
  0% {
    transform: scale(1);
  }
}
.loading {
  --size: 40px;
  position: absolute;
  z-index: 100000;
  top: calc(50% - var(--size) / 2);
  left: calc(50% - var(--size) / 2);
  width: var(--size);
  aspect-ratio: 1;
  animation: loading-animation 2.5s infinite linear both;
  .circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    animation: circle-animation 2s infinite ease-in-out both;
    &::before {
      content: '';
      display: block;
      width: 25%;
      height: 25%;
      background-color: white;
      border-radius: 100%;
      animation: circle-before-animation 2s infinite ease-in-out both;
    }

    --ratio: 0.1s;
    @for $i from 1 through 200 {
      &:nth-child(#{$i}) {
        animation-delay: calc(-1.2s + var(--ratio) * #{$i});
        &:before {
          animation-delay: calc(-1.2s + var(--ratio) * #{$i});
        }
      }
    }
  }
}
</style>
