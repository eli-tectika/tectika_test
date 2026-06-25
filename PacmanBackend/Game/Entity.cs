namespace PacmanBackend.Game;

public abstract class Entity
{
    public Position Position { get; protected set; }
    public Direction Direction { get; protected set; }

    protected Entity(Position position)
    {
        Position = position;
        Direction = Direction.None;
    }

    public virtual void Reset(Position position)
    {
        Position = position;
        Direction = Direction.None;
    }
}