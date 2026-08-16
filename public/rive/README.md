# Rive assets

Put exported `.riv` files in this folder.

Expected first-pass names:

- `logo.riv` — artboard default, state machine `LogoSM`
- `loading.riv` — state machine `LoadingSM`
- `home.riv` — state machine `HomeSM`
- `game.riv` — reserved for the game HUD / character UI

The Vue fallback UI remains visible until each Rive file loads successfully, so gameplay development can continue before final Rive assets are ready.
