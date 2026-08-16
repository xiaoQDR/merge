<script setup lang="ts">
import { onMounted } from 'vue'
import RiveCanvas from '../components/RiveCanvas.vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()

onMounted(() => {
  window.setTimeout(() => game.goTo('loading'), 900)
})
</script>

<template>
  <section class="screen logo-screen">
    <RiveCanvas src="/rive/logo.riv" state-machine="LogoSM">
      <div class="fallback-center">
        <div class="logo-mark">MERGE</div>
        <div class="logo-subtitle">A cozy merge adventure</div>
      </div>
    </RiveCanvas>
  </section>
</template>
