# Rive assets

All exported `.riv` files for the game live in this folder.

## Expected first-pass files

- `logo.riv` — logo / boot animation
- `loading.riv` — loading screen
- `home.riv` — home UI
- `game.riv` — game HUD / character / merge-game UI

The Vue fallback UI remains visible until each Rive file loads successfully, so gameplay development can continue before final Rive assets are ready.

## One-click Rive sync workflow

1. Export from Rive directly into this folder: `public/rive/`.
2. Keep the same file name when updating an existing asset and overwrite the old `.riv` file.
3. Double-click `push-rive.bat` in the repository root.
4. The script only stages and commits changes under `public/rive/`.
5. It automatically detects the current branch, rebases from the matching remote branch when it already exists, then pushes to `origin`.

Typical daily workflow:

```text
Rive Editor
  -> Export / overwrite home.riv
  -> public/rive/home.riv
  -> double-click push-rive.bat
  -> GitHub updated
```

`push-rive.ps1` contains the actual sync logic. `push-rive.bat` is only the Windows double-click launcher.

## Important

- Keep `push-rive.bat` and `push-rive.ps1` in the repository root.
- Git must be installed and available from the command line.
- The local repository must have an `origin` remote pointing to GitHub.
- Other changed code files are intentionally not included in the Rive sync commit.
