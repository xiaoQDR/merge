<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import RiveCanvas from '../components/RiveCanvas.vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const { loadingProgress } = storeToRefs(game)
let timer = 0

onMounted(() => {
  game.setLoadingProgress(0)
  timer = window.setInterval(() => {
    game.setLoadingProgress(loadingProgress.value + 8)
    if (loadingProgress.value >= 100) {
      window.clearInterval(timer)
      window.setTimeout(() => game.goTo('home'), 180)
    }
  }, 90)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <section class="screen loading-screen">
    <RiveCanvas src="/rive/loading.riv" state-machine="LoadingSM">
      <div class="fallback-center loading-fallback">
        <div class="loading-title">Loading</div>
        <div class="loading-track">
          <div class="loading-fill" :style="{ width: `${loadingProgress}%` }" />
        </div>
        <strong>{{ loadingProgress }}%</strong>
      </div>
    </RiveCanvas>
  </section>
</template>
