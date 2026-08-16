import Phaser from 'phaser'

const COLS = 7
const ROWS = 8
const CELL = 128
const GAP = 10
const BOARD_WIDTH = COLS * CELL + (COLS - 1) * GAP
const BOARD_HEIGHT = ROWS * CELL + (ROWS - 1) * GAP

export class MergeScene extends Phaser.Scene {
  constructor() {
    super('MergeScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')

    const startX = (1080 - BOARD_WIDTH) / 2
    const startY = 42

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const x = startX + col * (CELL + GAP)
        const y = startY + row * (CELL + GAP)
        const cell = this.add.rectangle(x, y, CELL, CELL, 0xf3e5c8, 1).setOrigin(0)
        cell.setStrokeStyle(4, 0xc8a97c, 0.7)
        cell.setInteractive({ useHandCursor: true })
        cell.on('pointerdown', () => this.spawnItem(x + CELL / 2, y + CELL / 2))
      }
    }

    const seed = [
      [1, 1, 1], [2, 1, 2], [4, 2, 1], [0, 4, 3], [3, 5, 2], [5, 6, 1],
    ]
    seed.forEach(([col, row, level]) => {
      const x = startX + col * (CELL + GAP) + CELL / 2
      const y = startY + row * (CELL + GAP) + CELL / 2
      this.spawnItem(x, y, level)
    })
  }

  private spawnItem(x: number, y: number, level = Phaser.Math.Between(1, 4)) {
    const colors = [0x9fd4c8, 0xf6c66c, 0xe7978e, 0xa8b8ed, 0xc9a7e8]
    const color = colors[(level - 1) % colors.length]
    const item = this.add.circle(x, y, 44, color, 1)
    item.setStrokeStyle(6, 0xffffff, 0.72)
    this.add.text(x, y, String(level), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#243958',
    }).setOrigin(0.5)
  }
}
