namespace PacmanBackend.Game;

public sealed class Tile
{
    public TileType Type { get; private set; }

    public Tile(TileType type)
    {
        Type = type;
    }

    public bool IsWalkable => Type != TileType.Wall;

    public void Consume()
    {
        if (Type == TileType.Pellet || Type == TileType.PowerPellet)
        {
            Type = TileType.Empty;
        }
    }
}