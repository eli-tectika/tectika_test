# Pacman Game Development Plan

Executive Summary
- Build a production-quality Pacman clone with clean architecture, strong test coverage, and a modular backend that cleanly separates core game logic from I/O (UI, storage, and API boundaries).
- Initial scope focuses on single-player classic Pacman mechanics (maze, pellets, power pellets, ghosts, scoring, lives). Stretch goals add leaderboards, multiple levels, and a menu UI.

Goals
- Faithful gameplay: movement, collisions, ghost AI modes (scatter/chase/frightened), power-up effects, score and lives, level progression.
- Maintainable architecture: isolate pure game engine from adapters (UI, persistence, API), support headless simulations for testing.
- Robust test suite: deterministic simulations of frames, collision outcomes, pathfinding, AI modes.
- CI/CD: build and test on push; easy packaging and release.

Non-Goals (for v1)
- Multiplayer, networked gameplay.
- Fancy graphics beyond a simple UI (CLI or basic UI in a separate task/repo).
- Modding or complex level editors.

Scope and Deliverables
- Core Game Engine (library): Grid/maze, entities, movement, collisions, scoring, ghost AI, level rules.
- Backend service/runner: Non-interactive simulation runner (for tests) and a simple API adapter for UI.
- Menu UI (separate task): start game, settings, leaderboard view.
- Leaderboard persistence (file-based initially, later DB).
- Documentation: architecture overview, API, test strategy.

Architecture Overview
- Layers
  1. Domain (Pure): GameState, Level, Entities (Pacman, Ghost, Pellet, PowerPellet), Rules, Systems (MovementSystem, CollisionSystem, ScoringSystem, GhostAISystem). No I/O. Deterministic, step-based.
  2. Application (Use Cases): GameService orchestrates engine step(), startLevel(), consumeInput(), serialize state. Coordinates components and enforces progression.
  3. Adapters (I/O):
     - UI Adapter: Menu UI invokes Application via an API boundary.
     - API Adapter: Minimal HTTP endpoints (optional) for external control (start, step, get state). For local UI, process boundary may be in-proc.
     - Persistence Adapter: Leaderboard storage (JSON file for v1), later replaceable with DB.
  4. Infrastructure: Configuration, logging, serialization, DI container.

- Data Flow
  - UI or simulation driver translates input into commands for Application layer.
  - Application calls Domain step() with a frame delta and inputs; receives updated GameState.
  - Persistence saves high scores/lives between sessions; optional API exposes state for UI polling.

- Entity and Grid Model
  - Grid: 2D tile map; walls, pellets, power pellets, tunnels.
  - Pacman: tile and sub-tile position, direction, speed; buffered inputs for cornering.
  - Ghosts: Red, Pink, Blue, Orange; modes (scatter, chase, frightened, eaten), targets computed per classic rules; pathfinding via BFS/A* on grid.
  - Rules: collision detection (Pacman/pellet, Pacman/ghost), frightened mode duration, extra life thresholds, level speed scaling.

- Update Loop
  - Fixed timestep (e.g., 60 FPS logical ticks). Each tick:
    1. Apply inputs (direction buffering).
    2. Move entities based on grid constraints and speeds.
    3. Resolve collisions and scoring.
    4. Update ghost AI modes/targets.
    5. Emit immutable GameState snapshot.

- API Boundary (optional for v1 UI)
  - POST /game/start {level}
  - POST /game/step {inputs, ticks}
  - GET /game/state
  - GET /leaderboard
  - POST /leaderboard {name, score}

- Tech Stack
  - .NET 9 (C#) for backend/engine. PacmanBackend currently contains a console entry; we will refactor into a class library (Engine) plus runners (simulation, API).
  - Testing: xUnit/NUnit with deterministic simulations; property-based tests for collision/pathfinding edge cases.
  - Persistence: JSON file via System.Text.Json for leaderboards.

Milestones and Schedule
- M0: Repo and CI foundation (1-2 days)
  - Replace root README; add DevelopmentPlan; set up .NET solution with projects: Pacman.Engine (class library), Pacman.Sim (console), Pacman.Api (optional, later), Pacman.Tests.
  - GitHub Actions: dotnet build/test on push.
  - Acceptance: CI green; plan published.

- M1: Grid and Movement (3-5 days)
  - Implement Level grid, tile semantics; Pacman movement with input buffering; tunnel wrap.
  - Basic Ghost movement without AI modes.
  - Acceptance: Deterministic tests for movement across tiles, corners, tunnels.

- M2: Collision and Scoring (3-4 days)
  - Pellet/power pellet consumption; score updates; lives; level completion detection.
  - Acceptance: Unit tests for collisions and score increments; level complete triggers.

- M3: Ghost AI Modes (5-7 days)
  - Scatter/chase/frightened/eaten with classic target calculations; mode timers; speed changes.
  - Acceptance: Scenario tests verifying target tiles per mode, frightened behavior, and re-spawn.

- M4: Level Rules and Progression (2-3 days)
  - Speed scaling, fruit spawn, bonus scoring, multi-level configuration.
  - Acceptance: Tests for level progression and speed tables.

- M5: Menu UI integration (3-4 days)
  - Menu UI task consumes Application layer via in-proc calls or minimal API; start game, pause, resume, show score.
  - Acceptance: Automated smoke test harness that steps the game and validates state changes.

- M6: Leaderboard Persistence (1-2 days)
  - JSON-backed leaderboard; submit and retrieve scores; validate input.
  - Acceptance: Persistence tests and serialization round-trips.

- M7: QA Hardening and Performance (2-3 days)
  - Property-based tests; frame time budget; profiling; fix hotspots.
  - Acceptance: 60 ticks/sec achievable in simulation on CI; test suite stable.

- M8: Release (1 day)
  - Versioning, changelog, packaging artifacts; README usage instructions.
  - Acceptance: Tagged release and runnable artifacts.

Risks and Mitigations
- Ghost AI correctness: Classic behavior can be subtle.
  - Mitigation: Implement reference scenarios and compare target tiles against known guides; use deterministic tests.
- Real-time input handling: Timing and buffering may cause jitter.
  - Mitigation: Fixed timestep with queued inputs; tests for cornering windows.
- Over-scoping API/UI: Building full HTTP API may delay core gameplay.
  - Mitigation: Prioritize Engine and Simulation; add API only if needed for UI.
- Performance on CI runners: Pathfinding per tick may be heavy.
  - Mitigation: Cache distance maps; optimize grid queries; measure under load.
- Data persistence integrity: File I/O races or corruption.
  - Mitigation: Atomic writes, schema validation, backups; later move to DB.
- Schedule risk: Feature coupling across milestones.
  - Mitigation: Keep engine modular; define crisp acceptance criteria; parallelize where safe.

Testing Strategy
- Unit tests: Entities, movement, collisions, scoring, AI target computation.
- Scenario tests: Recreate known maps and behaviors; run N ticks and assert expected positions/scores.
- Property-based tests: Valid paths avoid walls; pellets decrease monotonically when consumed.
- Serialization tests: GameState and Leaderboard round-trip.

CI/CD
- GitHub Actions workflow: dotnet restore/build/test; artifacts from Sim runner.
- Code coverage reporting; static analysis (Roslyn analyzers).

Documentation and Developer Experience
- docs/ with architecture and API; README with getting-started; contribution guidelines.
- Deterministic simulation harness enables rapid development without UI coupling.

Acceptance Criteria (Plan)
- This DevelopmentPlan file exists and is linked from README.
- Architecture, milestones, and risk assessment are clearly detailed and actionable.
- Build and test pipelines are described and scheduled in milestones.

Appendix: Initial File/Project Layout (target)
- src/Pacman.Engine: core domain logic
- src/Pacman.Sim: simulation runner (non-interactive)
- src/Pacman.Api: optional minimal API
- tests/Pacman.Tests: test suite
- docs/: DevelopmentPlan, Architecture notes
