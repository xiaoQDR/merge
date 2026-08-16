# Merge

A lightweight merge-game client built around **Rive + Phaser + TypeScript**.

## Architecture

- **Rive** owns Logo, Loading, Home, game HUD, animation, and UI presentation.
- **Phaser** is created only for the merge-board gameplay layer.
- **TypeScript** is the glue between Rive, loading/data, and Phaser.
- **Vite** is only the development/build tool.

Vue and Pinia are intentionally not used.

## Boot flow

```text
merge_logo.riv
  -> merge_loading.riv
  -> preload merge_home.riv
  -> merge_home.riv
```

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
