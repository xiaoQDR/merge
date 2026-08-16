export interface PlayerResources {
  energy: number
  energyMax: number
  coins: number
  gems: number
}

export interface GameData {
  playerName: string
  playerLevel: number
  resources: PlayerResources
}

export const gameData: GameData = {
  playerName: 'Player',
  playerLevel: 12,
  resources: {
    energy: 24,
    energyMax: 30,
    coins: 12840,
    gems: 320,
  },
}
