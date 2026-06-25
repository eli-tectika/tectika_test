# Pacman Game

A modern web-based reimagining of the classic Pacman arcade game. This monorepo currently contains:

- PacmanWeb — ASP.NET Core static web host for the game menu UI and future game client
- PacmanBackend — Placeholder console project for backend/game logic (to be expanded)

## Quick start

Prerequisites: .NET SDK 9.x

Run the web UI locally:

1. Build: `dotnet build PacmanWeb/PacmanWeb.csproj`
2. Run: `dotnet run --project PacmanWeb/PacmanWeb.csproj`
3. Open http://localhost:5000 (or the URL shown in console) — you should see the Pacman welcome and menu.

## Structure

- /PacmanWeb — Web host and static assets
  - wwwroot/index.html — Welcome page and main menu
  - wwwroot/app.js — Menu logic, options, high scores (localStorage)
  - wwwroot/styles.css — Styling with light/dark themes
- /PacmanBackend — Backend (WIP)
- PACMAN_NOTES.md — Notes about the game

## Roadmap (excerpt)

- Integrate game canvas and loop into PacmanWeb
- Wire settings to game engine
- Persist high scores to a backend once available

See PACMAN_NOTES.md for more background.