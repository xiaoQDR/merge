<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from './stores/game'
import LogoScreen from './screens/LogoScreen.vue'
import LoadingScreen from './screens/LoadingScreen.vue'
import HomeScreen from './screens/HomeScreen.vue'
import GameScreen from './screens/GameScreen.vue'

const game = useGameStore()
const { screen } = storeToRefs(game)
</script>

<template>
  <main class="app-shell">
    <Transition name="screen-fade" mode="out-in">
      <LogoScreen v-if="screen === 'logo'" key="logo" />
      <LoadingScreen v-else-if="screen === 'loading'" key="loading" />
      <HomeScreen v-else-if="screen === 'home'" key="home" />
      <GameScreen v-else key="game" />
    </Transition>
  </main>
</template>
