# Merge

A lightweight merge-game client built around **Rive + Phaser + TypeScript**.

## Live Web

GitHub Pages: https://xiaoqdr.github.io/merge/

## Architecture

- **Rive** owns Home, game HUD, animation, and UI presentation.
- **Phaser** is created only for the merge-board gameplay layer.
- **TypeScript** is the glue between Rive, game data, and Phaser.
- **Vite** is only the development/build tool.

Vue and Pinia are intentionally not used.

## Boot flow

```text
merge_home.riv
```

The app boots directly into Home. Logo and Loading are not part of the startup flow.

Rive assets live in `public/rive/merge/`.

## Development

```bash
npm install
npm run dev
```

Build validation:

```bash
npm run build
```
