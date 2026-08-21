import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas-single'

export interface RiveScreenConfig {
  src: string
  artboard?: string
  stateMachine?: string
  fit?: Fit
  onStateChange?: (states: string[]) => void
}

export class RiveScreen {
  private readonly canvas = document.createElement('canvas')
  private readonly observer: ResizeObserver
  private rive: Rive | null = null
  private stateMachine: string | undefined
  private loadToken = 0

  private readonly resize = () => {
    this.rive?.resizeDrawingSurfaceToCanvas()
  }

  constructor(private readonly host: HTMLElement) {
    this.canvas.className = 'rive-canvas'
    this.host.replaceChildren(this.canvas)

    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(this.host)
    window.addEventListener('resize', this.resize)
  }

  async show(config: RiveScreenConfig) {
    const token = ++this.loadToken
    this.cleanupRuntime()
    this.stateMachine = config.stateMachine

    await new Promise<void>((resolve, reject) => {
      let instance: Rive

      instance = new Rive({
        src: config.src,
        canvas: this.canvas,
        artboard: config.artboard,
        autoplay: true,
        autoBind: true,
        stateMachines: config.stateMachine,
        layout: new Layout({
          fit: config.fit ?? Fit.Cover,
          alignment: Alignment.Center,
        }),
        onLoad: () => {
          if (token !== this.loadToken) return
          this.rive = instance
          this.resize()

          if (config.stateMachine && !instance.stateMachineNames.includes(config.stateMachine)) {
            console.warn(
              `[Merge] State machine "${config.stateMachine}" was not found in ${config.src}.`,
              'Available:',
              instance.stateMachineNames,
            )
          }

          resolve()
        },
        onLoadError: () => {
          if (token !== this.loadToken) return
          reject(new Error(`Failed to load Rive file: ${config.src}`))
        },
        onStateChange: (event) => {
          if (token !== this.loadToken) return
          const raw = event.data
          const states = (Array.isArray(raw) ? raw : [raw]).filter(
            (value): value is string => typeof value === 'string',
          )
          config.onStateChange?.(states)
        },
      })

      this.rive = instance
    })
  }

  setNumber(names: string | string[], value: number) {
    if (!this.rive || !this.stateMachine) return false

    const candidates = Array.isArray(names) ? names : [names]
    const inputs = this.rive.stateMachineInputs(this.stateMachine) ?? []

    for (const name of candidates) {
      const input = inputs.find((candidate) => candidate.name === name)
      if (input && typeof input.value === 'number') {
        input.value = value
        return true
      }
    }

    return false
  }

  setBoolean(names: string | string[], value: boolean) {
    if (!this.rive || !this.stateMachine) return false

    const candidates = Array.isArray(names) ? names : [names]
    const inputs = this.rive.stateMachineInputs(this.stateMachine) ?? []

    for (const name of candidates) {
      const input = inputs.find((candidate) => candidate.name === name)
      if (input && typeof input.value === 'boolean') {
        input.value = value
        return true
      }
    }

    return false
  }

  fire(names: string | string[]) {
    if (!this.rive || !this.stateMachine) return false

    const candidates = Array.isArray(names) ? names : [names]
    const inputs = this.rive.stateMachineInputs(this.stateMachine) ?? []

    for (const name of candidates) {
      const input = inputs.find((candidate) => candidate.name === name)
      if (input && typeof input.fire === 'function') {
        input.fire()
        return true
      }
    }

    return false
  }

  destroy() {
    ++this.loadToken
    this.cleanupRuntime()
    this.observer.disconnect()
    window.removeEventListener('resize', this.resize)
  }

  private cleanupRuntime() {
    this.rive?.cleanup()
    this.rive = null
  }
}
