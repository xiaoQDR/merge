<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Fit } from '@rive-app/canvas'
import RiveCanvas from '../components/RiveCanvas.vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const { loadingProgress } = storeToRefs(game)
let progressTimer = 0
let finishTimer = 0
let started = false
let disposed = false

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

async function preloadHome() {
  const response = await fetch('/rive/merge/merge_home.riv', { cache: 'force-cache' })
  if (!response.ok) {
    throw new Error(`Failed to preload merge_home.riv: ${response.status}`)
  }
  await response.arrayBuffer()
}

async function beginLoading() {
  if (started || disposed) return
  started = true
  game.setLoadingProgress(8)

  progressTimer = window.setInterval(() => {
    if (loadingProgress.value < 90) {
      game.setLoadingProgress(loadingProgress.value + 4)
    }
  }, 80)

  const results = await Promise.allSettled([preloadHome(), sleep(1400)])
  const preloadResult = results[0]
  if (preloadResult.status === 'rejected') {
    console.warn('[LoadingScreen] Home Rive preload failed; continuing normally.', preloadResult.reason)
  }

  if (disposed) return
  window.clearInterval(progressTimer)
  game.setLoadingProgress(100)
  finishTimer = window.setTimeout(() => game.goTo('home'), 220)
}

function handleError(error: unknown) {
  console.error('[LoadingScreen] Failed to load merge_loading.riv', error)
  void beginLoading()
}

onBeforeUnmount(() => {
  disposed = true
  window.clearInterval(progressTimer)
  window.clearTimeout(finishTimer)
})
</script>

<template>
  <section class="screen loading-screen">
    <RiveCanvas
      src="/rive/merge/merge_loading.riv"
      state-machine="LoadingSM"
      :fit="Fit.Cover"
      @load="beginLoading"
      @error="handleError"
    >
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
