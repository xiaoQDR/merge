import { Fit } from '@rive-app/canvas-single'
import type Phaser from 'phaser'
import { createMergeGame } from '../game/createGame'
import { RiveScreen } from '../rive/RiveScreen'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const RIVE = {
  home: assetUrl('rive/merge/merge_home.riv'),
  game: assetUrl('rive/merge/merge_game.riv'),
} as const

type AppStage = 'boot' | 'home' | 'game'

export class GameApp {
  private stage: AppStage = 'boot'
  private readonly rive: RiveScreen
  private phaser: Phaser.Game | null = null

  constructor(private readonly root: HTMLElement) {
    this.root.className = 'game-root'
    this.rive = new RiveScreen(root)
  }

  async start() {
    await this.showHome()
  }

  private async showHome() {
    this.stage = 'home'

    try {
      await this.rive.show({
        src: RIVE.home,
        stateMachine: 'homeSM',
        fit: Fit.Cover,
      })
    }
    catch (error) {
      console.error('[Merge] Home Rive failed to load.', error)
    }
  }

  async startGame() {
    if (this.stage === 'game') return

    this.stage = 'game'
    this.phaser?.destroy(true)
    this.phaser = null

    try {
      await this.rive.show({
        src: RIVE.game,
        stateMachine: 'GameSM',
        fit: Fit.Cover,
      })
    }
    catch (error) {
      console.error('[Merge] Game Rive failed to load.', error)
    }

    const board = document.createElement('div')
    board.className = 'phaser-host'
    this.root.append(board)
    this.phaser = createMergeGame(board)
  }
}
