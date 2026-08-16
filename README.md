# Merge

A mobile-first merge game starter built with Vue 3, TypeScript, Pinia, Phaser 3 and Rive.

## Architecture

- **Vue 3**: screen composition, DOM shell and debug/fallback UI
- **Pinia**: player resources, page flow and gameplay state
- **Rive**: production UI/animation layer (`public/rive`)
- **Phaser 3**: merge board and gameplay rendering
- **Vite**: development/build toolchain

## Screen flow

`Logo -> Loading -> Home -> Game`

## Run

```bash
npm install
npm run dev
```

For LAN/mobile testing, Vite is configured with `0.0.0.0`, so open the address printed by Vite from a device on the same network.

## Rive convention (first pass)

| File | State machine | Responsibility |
| --- | --- | --- |
| `logo.riv` | `LogoSM` | logo entrance/outro |
| `loading.riv` | `LoadingSM` | loading presentation |
| `home.riv` | `HomeSM` | avatar/resources/store/mail/settings/tasks/start |
| `game.riv` | `GameSM` | HUD/character/goal tray (reserved) |

`src/components/RiveCanvas.vue` is the single bridge between Vue and Rive. Keep Rive runtime calls there instead of scattering them across pages.

## Next integration step

Export your Rive files to `public/rive/`, keep the state-machine names above, then bind Rive events / ViewModel values to Pinia actions and state.
