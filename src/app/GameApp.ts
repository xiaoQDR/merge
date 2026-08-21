import { Fit } from '@rive-app/canvas'
import type Phaser from 'phaser'
import { createMergeGame } from '../game/createGame'
import { RiveScreen } from '../rive/RiveScreen'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const RIVE = {
  logo: assetUrl('rive/merge/merge_logo.riv'),
  loading: assetUrl('rive/merge/merge_loading.riv'),
  home: assetUrl('rive/merge/merge_home.riv'),
  game: assetUrl('rive/merge/merge_game.riv'),
} as const

type AppStage = 'boot' | 'logo' | 'loading' | 'home' | 'game'

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

export class GameApp {
  private stage: AppStage = 'boot'
  private readonly rive: RiveScreen
  private phaser: Phaser.Game | null = null
  private transitionTimer = 0

  constructor(private readonly root: HTMLElement) {
    this.root.className = 'game-root'
    this.rive = new RiveScreen(root)
  }

  async start() {
    await this.showLogo()
  }

  private clearTransitionTimer() {
    if (this.transitionTimer) {
      window.clearTimeout(this.transitionTimer)
      this.transitionTimer = 0
    }
  }

  private async showLogo() {
    this.stage = 'logo'
    this.clearTransitionTimer()

    const advance = () => {
      if (this.stage !== 'logo') return
      void this.showLoading()
    }

    this.transitionTimer = window.setTimeout(advance, 2200)

    try {
      await this.rive.show({
        src: RIVE.logo,
        stateMachine: 'LogoSM',
        fit: Fit.Cover,
        onStateChange: (states) => {
          if (states.includes('logoExit')) advance()
        },
      })
    }
    catch (error) {
      console.error('[Merge] Logo Rive failed to load.', error)
      advance()
    }
  }

  private async showLoading() {
    if (this.stage === 'loading' || this.stage === 'home' || this.stage === 'game') return

    this.stage = 'loading'
    this.clearTransitionTimer()

    try {
      await this.rive.show({
        src: RIVE.loading,
        stateMachine: 'LoadingSM',
        fit: Fit.Cover,
      })

      const loadHome = this.preloadAsset(RIVE.home, (ratio) => {
        this.rive.setNumber(['progress', 'loadingProgress'], Math.round(ratio * 100))
      })

      await Promise.all([loadHome, delay(650)])
    }
    catch (error) {
      console.error('[Merge] Loading screen failed.', error)
      await delay(350)
    }

    if (this.stage === 'loading') {
      await this.showHome()
    }
  }

  private async showHome() {
    this.stage = 'home'
    this.clearTransitionTimer()

    try {
      await this.rive.show({
        src: RIVE.home,
        stateMachine: 'HomeSM',
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
    this.clearTransitionTimer()
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

  private async preloadAsset(url: string, onProgress: (ratio: number) => void) {
    onProgress(0)

    const response = await fetch(url, { cache: 'force-cache' })
    if (!response.ok) {
      throw new Error(`Failed to preload ${url}: ${response.status}`)
    }

    const total = Number(response.headers.get('content-length') ?? 0)
    const reader = response.body?.getReader()

    if (!reader) {
      await response.arrayBuffer()
      onProgress(1)
      return
    }

    let loaded = 0
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      loaded += chunk.value.byteLength
      if (total > 0) onProgress(Math.min(1, loaded / total))
    }

    onProgress(1)
  }
}
