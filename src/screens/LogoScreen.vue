<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Fit } from '@rive-app/canvas'
import RiveCanvas from '../components/RiveCanvas.vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()
let fallbackTimer = 0
let exitTimer = 0
let leaving = false

function goToLoading(delay = 0) {
  if (leaving) return
  leaving = true
  window.clearTimeout(fallbackTimer)
  exitTimer = window.setTimeout(() => game.goTo('loading'), delay)
}

function handleLoad() {
  // Safety fallback: if the Rive state machine does not reach logoExit,
  // still continue into the game boot flow.
  fallbackTimer = window.setTimeout(() => goToLoading(), 3200)
}

function handleStateChange(states: string[]) {
  if (states.includes('logoExit')) {
    // Give the exit animation a short moment to finish before swapping screens.
    goToLoading(500)
  }
}

function handleError(error: unknown) {
  console.error('[LogoScreen] Failed to load merge_logo.riv', error)
  goToLoading(300)
}

onBeforeUnmount(() => {
  window.clearTimeout(fallbackTimer)
  window.clearTimeout(exitTimer)
})
</script>

<template>
  <section class="screen logo-screen">
    <RiveCanvas
      src="/rive/merge/merge_logo.riv"
      artboard="Logo"
      state-machine="LogoSM"
      :fit="Fit.Cover"
      @load="handleLoad"
      @state-change="handleStateChange"
      @error="handleError"
    >
      <div class="fallback-center">
        <div class="logo-mark">MERGE</div>
        <div class="logo-subtitle">A cozy merge adventure</div>
      </div>
    </RiveCanvas>
  </section>
</template>
