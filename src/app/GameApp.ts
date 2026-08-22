import { Fit } from '@rive-app/canvas-single'
import type Phaser from 'phaser'
import { createMergeGame } from '../game/createGame'
import { RiveScreen } from '../rive/RiveScreen'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const RIVE = {
  home: assetUrl('rive/merge/merge_home.riv'),
  game: assetUrl('rive/merge/merge_game.riv'),
} as const

type AppStage = 'boot' | 'main' | 'game'

export class GameApp {
  private stage: AppStage = 'boot'
  private readonly rive: RiveScreen
  private readonly resolutionLabel = document.createElement('div')
  private phaser: Phaser.Game | null = null

  private readonly updateResolution = () => {
    const viewport = window.visualViewport
    const width = Math.round(viewport?.width ?? window.innerWidth)
    const height = Math.round(viewport?.height ?? window.innerHeight)
    this.resolutionLabel.textContent = `${width} × ${height}`
  }

  constructor(private readonly root: HTMLElement) {
    this.root.className = 'game-root'
    this.rive = new RiveScreen(root)

    this.resolutionLabel.className = 'resolution-overlay'
    this.resolutionLabel.setAttribute('aria-label', 'Current screen resolution')
    this.root.append(this.resolutionLabel)

    this.updateResolution()
    window.addEventListener('resize', this.updateResolution)
    window.visualViewport?.addEventListener('resize', this.updateResolution)
  }

  async start() {
    await this.showMain()
  }

  private async showMain() {
    this.stage = 'main'

    try {
      await this.rive.show({
        src: RIVE.home,
        fit: Fit.Layout,
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
        artboard: 'Game',
        stateMachine: 'GameSM',
        fit: Fit.Fill,
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
