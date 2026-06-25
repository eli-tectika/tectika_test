using System.Text.Json;

namespace PacmanBackend.Game;

public sealed class GameEngine
{
    private readonly GameState _state;
    private readonly Random _rng;

    public GameEngine(GameState state, int? seed = null)
    {
        _state = state;
        _rng = seed.HasValue ? new Random(seed.Value) : new Random();
    }

    public IReadOnlyDictionary<string, object> Snapshot()
    {
        return new Dictionary<string, object>
        {
            ["tick"] = _state.TickCount,
            ["score"] = _state.Score,
            ["lives"] = _state.Lives,
            ["pacman"] = new { x = _state.Pacman.Position.X, y = _state.Pacman.Position.Y },
            ["ghosts"] = _state.Ghosts.Select(g => new { x = g.Position.X, y = g.Position.Y, mode = g.Mode.ToString() }).ToArray(),
            ["remainingPellets"] = _state.Map.RemainingPellets(),
            ["gameOver"] = _state.GameOver
        };
    }

    public string SnapshotJson() => JsonSerializer.Serialize(Snapshot());

    public void ApplyPacmanDirection(Direction desired)
    {
        _state.Pacman.Direction = desired;
    }

    public void Step()
    {
        if (_state.GameOver) return;

        // Move Pacman if possible
        var nextPac = _state.Pacman.Position.Move(_state.Pacman.Direction);
        if (_state.Map.InBounds(nextPac) && _state.Map.IsWalkable(nextPac))
        {
            _state.Pacman.Position = nextPac;
            var tile = _state.Map.GetTile(nextPac);
            if (tile.Type == TileType.Pellet)
            {
                _state.AddScore(10);
                tile.Consume();
            }
            else if (tile.Type == TileType.PowerPellet)
            {
                _state.AddScore(50);
                tile.Consume();
                foreach (var g in _state.Ghosts)
                    g.SetFrightened(10); // frightened for 10 ticks
            }
        }

        // Move ghosts
        foreach (var g in _state.Ghosts)
        {
            var dir = ChooseGhostDirection(g);
            var next = g.Position.Move(dir);
            if (_state.Map.InBounds(next) && _state.Map.IsWalkable(next))
            {
                g.Position = next;
                g.Direction = dir;
            }
            g.Tick();
        }

        // Collisions
        foreach (var g in _state.Ghosts)
        {
            if (g.Position.X == _state.Pacman.Position.X && g.Position.Y == _state.Pacman.Position.Y)
            {
                if (g.Mode == GhostMode.Frightened)
                {
                    _state.AddScore(200);
                    g.Reset(g.StartPosition);
                }
                else
                {
                    _state.LoseLife();
                    break; // one collision per tick
                }
            }
        }

        _state.IncrementTick();
    }

    private Direction ChooseGhostDirection(Ghost g)
    {
        // Simple heuristic: if frightened, move randomly; else try to reduce manhattan distance to Pacman
        var candidates = new[] { Direction.Up, Direction.Down, Direction.Left, Direction.Right };
        var valid = candidates.Where(d =>
        {
            var n = g.Position.Move(d);
            return _state.Map.InBounds(n) && _state.Map.IsWalkable(n);
        }).ToList();

        if (valid.Count == 0) return Direction.None;

        if (g.Mode == GhostMode.Frightened)
        {
            return valid[_rng.Next(valid.Count)];
        }
        else
        {
            var target = _state.Pacman.Position;
            // Prefer directions that reduce distance
            var best = valid
                .OrderBy(d => Position.Manhattan(g.Position.Move(d), target))
                .ThenBy(_ => _rng.Next()) // tie-breaker
                .First();
            return best;
        }
    }
}