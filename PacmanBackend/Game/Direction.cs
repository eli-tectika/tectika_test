namespace PacmanBackend.Game;

public enum Direction
{
    None = 0,
    Up,
    Down,
    Left,
    Right
}

public static class DirectionHelpers
{
    public static (int dx, int dy) Delta(this Direction dir) => dir switch
    {
        Direction.Up => (0, -1),
        Direction.Down => (0, 1),
        Direction.Left => (-1, 0),
        Direction.Right => (1, 0),
        _ => (0, 0)
    };
}