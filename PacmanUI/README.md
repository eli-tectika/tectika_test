# PacmanUI

A web-based menu UI and welcoming page for Pacman. This is a standalone, accessible UI that works without a backend and includes automated tests.

## Features
- Title screen and main menu with Start Game, Options, High Scores, Help/About, Exit/Back
- Keyboard (↑/↓/Enter) and mouse navigation
- Options page: sound on/off, difficulty (Easy/Normal/Hard) persisted via localStorage
- High Scores view: reads from a local stub (public/highscores.json) when backend is unavailable
- Configurable API base URL (via localStorage pacmanConfig) and a mock-friendly data provider
- Pacman-themed styling with clear focus states
- Non-interactive verification with Vitest and jsdom

## Getting Started (in this sandbox)
1. Change directory:
   - `cd PacmanUI`
2. Install dependencies:
   - `npm ci`
3. Run tests:
   - `npm test`
4. Build static assets:
   - `npm run build`

Artifacts are emitted to `PacmanUI/dist` and can be served by any static file server.

## Configuration
- Options are persisted under `localStorage.pacmanOptions`.
- API base URL (optional) under `localStorage.pacmanConfig` as JSON: `{ "apiBaseUrl": "https://example.com/api" }`.
  When set, the UI will attempt to fetch `/highscores` from that base URL; on failure, it falls back to `public/highscores.json` and then to an in-memory stub.

## Tests
Vitest runs in a jsdom environment.
- Start transitions to game state
- Options persistence across reloads
- High scores render from stub data

Run: `npm test`
