namespace PacmanBackend.Game;

public sealed class Ghost : Entity
{
    public GhostMode Mode { get; private set; } = GhostMode.Scatter;
    public int FrightenedTicks { get; private set; } = 0;
    public readonly Position StartPosition;

    public Ghost(Position position) : base(position)
    {
        StartPosition = position;
    }

    public void SetFrightened(int ticks)
    {
        Mode = GhostMode.Frightened;
        FrightenedTicks = ticks;
    }

    public void Tick()
    {
        if (Mode == GhostMode.Frightened)
        {
            FrightenedTicks--;
            if (FrightenedTicks <= 0) Mode = GhostMode.Chase;
        }
    }

    public override void Reset(Position position)
    {
        base.Reset(position);
        Mode = GhostMode.Scatter;
        FrightenedTicks = 0;
    }
}