import Phaser from 'phaser'
import { MergeScene } from './scenes/MergeScene'

export function createMergeGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1080,
    height: 1120,
    transparent: true,
    backgroundColor: 'rgba(0,0,0,0)',
    scene: [MergeScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1080,
      height: 1120,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
  })
}
