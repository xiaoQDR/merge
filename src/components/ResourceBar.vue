<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const { resources } = storeToRefs(game)
</script>

<template>
  <div class="resource-bar">
    <div class="avatar">P</div>
    <div class="resource energy">⚡ {{ resources.energy }}/{{ resources.energyMax }}</div>
    <div class="resource">🪙 {{ resources.coins.toLocaleString() }}</div>
    <div class="resource">💎 {{ resources.gems.toLocaleString() }}</div>
    <button class="shop-button" aria-label="商店">＋</button>
  </div>
</template>

<style scoped>
.resource-bar {
  display: grid;
  grid-template-columns: 84px 1.25fr 1fr 1fr 68px;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.avatar,
.resource,
.shop-button {
  min-height: 58px;
  border: 3px solid rgba(255,255,255,.72);
  box-shadow: 0 7px 0 rgba(15, 35, 64, .25);
}

.avatar {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #f1c083;
  font-weight: 900;
  font-size: 28px;
}

.resource {
  display: grid;
  place-items: center;
  padding: 0 14px;
  border-radius: 22px;
  background: rgba(24, 49, 82, .78);
  color: white;
  font-weight: 800;
  white-space: nowrap;
}

.energy { background: rgba(80, 139, 91, .86); }

.shop-button {
  border-radius: 20px;
  background: #ffcc55;
  color: #4b3820;
  font-size: 34px;
  font-weight: 900;
}
</style>
