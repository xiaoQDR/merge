<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type Phaser from 'phaser'
import ResourceBar from '../components/ResourceBar.vue'
import { createMergeGame } from '../game/createGame'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const phaserHost = ref<HTMLElement | null>(null)
let phaser: Phaser.Game | null = null

onMounted(() => {
  if (phaserHost.value) phaser = createMergeGame(phaserHost.value)
})

onBeforeUnmount(() => {
  phaser?.destroy(true)
  phaser = null
})
</script>

<template>
  <section class="screen game-screen">
    <header class="game-top">
      <ResourceBar />
      <button class="home-button" @click="game.backHome">⌂</button>
    </header>

    <section class="character-stage">
      <div class="character-bust">NPC</div>
      <div class="goal-tray">
        <div v-for="goal in game.goals" :key="goal.id" class="goal-item">
          <span>{{ goal.id }}</span>
          <strong>Lv.{{ goal.level }}</strong>
          <small>{{ goal.completed }}/{{ goal.amount }}</small>
        </div>
      </div>
    </section>

    <div ref="phaserHost" class="phaser-host" />
  </section>
</template>
