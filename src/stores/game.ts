import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AppScreen, MergeGoal, PlayerResources } from '../types/game'

export const useGameStore = defineStore('game', () => {
  const screen = ref<AppScreen>('logo')
  const loadingProgress = ref(0)
  const playerName = ref('Player')
  const playerLevel = ref(12)
  const resources = ref<PlayerResources>({
    energy: 24,
    energyMax: 30,
    coins: 12840,
    gems: 320,
  })
  const goals = ref<MergeGoal[]>([
    { id: 'cup', level: 3, amount: 1, completed: 0 },
    { id: 'cake', level: 4, amount: 2, completed: 0 },
    { id: 'flower', level: 5, amount: 1, completed: 0 },
  ])

  const energyRatio = computed(() => resources.value.energy / resources.value.energyMax)

  function goTo(next: AppScreen) {
    screen.value = next
  }

  function setLoadingProgress(value: number) {
    loadingProgress.value = Math.min(100, Math.max(0, value))
  }

  function spendEnergy(amount = 1) {
    if (resources.value.energy < amount) return false
    resources.value.energy -= amount
    return true
  }

  function startGame() {
    goTo('game')
  }

  function backHome() {
    goTo('home')
  }

  return {
    screen,
    loadingProgress,
    playerName,
    playerLevel,
    resources,
    goals,
    energyRatio,
    goTo,
    setLoadingProgress,
    spendEnergy,
    startGame,
    backHome,
  }
})
