<script setup lang="ts">
import ResourceBar from '../components/ResourceBar.vue'
import RiveCanvas from '../components/RiveCanvas.vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()
</script>

<template>
  <section class="screen home-screen">
    <RiveCanvas src="/rive/home.riv" state-machine="HomeSM">
      <div class="home-fallback">
        <header class="top-ui">
          <ResourceBar />
          <div class="side-actions">
            <button>✉</button>
            <button>⚙</button>
          </div>
        </header>

        <main class="home-stage">
          <div class="home-card">
            <div class="eyebrow">CURRENT STORY</div>
            <h1>Garden Café</h1>
            <p>完成订单，修复咖啡馆并推进剧情。</p>
          </div>
        </main>

        <footer class="bottom-actions">
          <button class="secondary-button">任务</button>
          <button class="primary-button" @click="game.startGame">开始游戏</button>
        </footer>
      </div>
    </RiveCanvas>
  </section>
</template>
