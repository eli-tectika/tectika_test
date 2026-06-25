# Pacman Menu UI — Design and Implementation Notes

Author: Lead Engineer
Date: 2026-06-25

## Scope
Create a production-ready welcoming page and menu UI for the Pacman game, with options and high scores. Implement as a simple, secure, accessible web client that can evolve into the full game UI.

## Inferred requirements
- Welcome screen with Start Game, Options, High Scores, Credits.
- Options: difficulty, sound volume, theme, control mapping.
- High Scores: view and clear local scores; backend integration later.
- Theme toggle (light/dark) accessible globally.
- Persist settings locally (localStorage) until backend exists.
- Non-interactive environment compatibility: UI runs without server prompts.
- Accessibility: keyboard navigation, ARIA roles, clean focus states.
- Secure defaults: sanitize user-entered values, no external code injection.

## Architecture & stack
- ASP.NET Core Minimal Web Host (PacmanWeb) serving static files from wwwroot.
- Pure HTML/CSS/JS client — no framework dependency for simplicity.
- Client-side state persisted in localStorage; sanitized on load/save.
- Routing: single-page display via show/hide sections; server fallback to index.html.

Rationale: Small footprint, fast build and run, easy to integrate with future game canvas or backends.

## Feature set implemented
- Welcome screen with primary Start and secondary actions.
- Options UI with validation and control-key capture.
- High Scores viewer with sample data, sorting, and clear-local button.
- Credits page.
- Global dark/light theme toggle; per-setting theme select (classic/neon/dark) for later styling hooks.
- Version display; simple health endpoint (/health).
- Input sanitation to prevent storing unsafe values; escapeHtml in highscores rendering.

## What’s deliberately left out (and why)
- Actual game canvas/loop: separate task; avoids mixing concerns in menu work.
- Backend persistence for scores/settings: backend is WIP; localStorage suffices for initial UX.
- Authentication/user profiles: not needed for MVP; add when cloud persistence is introduced.
- Complex routing or framework: overkill for a small menu; keep lightweight.

## Open questions / decisions
- Visual theme details (classic vs neon palettes) — ready to define once game art direction is approved.
- High score persistence endpoint spec — define once backend task resumes.
- Localization — can be added via simple i18n string table if required.

## Files added
- PacmanWeb/Program.cs — static file hosting, default file + fallback, /health.
- PacmanWeb/wwwroot/index.html — Menu and screens.
- PacmanWeb/wwwroot/styles.css — Styling and themes.
- PacmanWeb/wwwroot/app.js — UI logic, state, validation.
- README.md — updated repo overview and run instructions.

## How to run
- Build: `dotnet build PacmanWeb/PacmanWeb.csproj`
- Run: `dotnet run --project PacmanWeb/PacmanWeb.csproj`
- Browse: http://localhost:5000 (or the URL shown by Kestrel)

## Next steps
- Integrate game scene and canvas; route Start Game to initialize the loop.
- Wire options to influence game runtime (speed, ghost AI, audio levels).
- Replace localStorage with backend endpoints when ready.
