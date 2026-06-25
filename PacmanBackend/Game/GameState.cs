namespace PacmanBackend.Game;

public sealed class GameState
{
    public Map Map { get; }
    public Pacman Pacman { get; }
    public List<Ghost> Ghosts { get; }
    public int Score { get; private set; }
    public int Lives { get; private set; }
    public int TickCount { get; private set; }
    public bool GameOver => Lives <= 0 || Map.RemainingPellets() == 0;

    public GameState(Map map, Position pacmanStart, Position[] ghostStarts, int lives = 3)
    {
        Map = map;
        Pacman = new Pacman(pacmanStart);
        Ghosts = ghostStarts.Select(gs => new Ghost(gs)).ToList();
        Score = 0;
        Lives = lives;
        TickCount = 0;
    }

    public void AddScore(int points) => Score += points;

    public void LoseLife()
    {
        Lives--;
        // Reset positions
        Pacman.Reset(Pacman.Position);
        foreach (var g in Ghosts) g.Reset(g.StartPosition);
    }

    public void IncrementTick() => TickCount++;
}