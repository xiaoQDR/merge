# Rive assets

All exported `.riv` files for the game live in this folder.

## Expected first-pass files

- `logo.riv` — logo / boot animation
- `loading.riv` — loading screen
- `home.riv` — home UI
- `game.riv` — game HUD / character / merge-game UI

The Vue fallback UI remains visible until each Rive file loads successfully, so gameplay development can continue before final Rive assets are ready.

## Workflow

1. Export the `.riv` file from Rive.
2. Upload or replace the matching file in `public/rive/` on GitHub.
3. Commit the change manually.

When updating an existing asset, keep the same filename so the game code does not need to change.
