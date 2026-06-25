namespace PacmanBackend.Game;

public readonly struct Position
{
    public int X { get; }
    public int Y { get; }

    public Position(int x, int y)
    {
        X = x;
        Y = y;
    }

    public Position Move(Direction dir)
    {
        var (dx, dy) = dir.Delta();
        return new Position(X + dx, Y + dy);
    }

    public override string ToString() => $"({X},{Y})";

    public static int Manhattan(Position a, Position b) => Math.Abs(a.X - b.X) + Math.Abs(a.Y - b.Y);
}