export type AppScreen = 'logo' | 'loading' | 'home' | 'game'

export interface PlayerResources {
  energy: number
  energyMax: number
  coins: number
  gems: number
}

export interface MergeGoal {
  id: string
  level: number
  amount: number
  completed: number
}
