using System.Text;

namespace PacmanBackend.Game;

public sealed class Map
{
    public int Width { get; }
    public int Height { get; }
    private readonly Tile[,] _tiles;

    public Map(int width, int height)
    {
        Width = width;
        Height = height;
        _tiles = new Tile[width, height];
        for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++)
            _tiles[x, y] = new Tile(TileType.Empty);
    }

    public Tile GetTile(Position p) => _tiles[p.X, p.Y];

    public bool InBounds(Position p) => p.X >= 0 && p.X < Width && p.Y >= 0 && p.Y < Height;

    public bool IsWalkable(Position p) => InBounds(p) && GetTile(p).IsWalkable;

    public int RemainingPellets()
    {
        var count = 0;
        for (var y = 0; y < Height; y++)
        for (var x = 0; x < Width; x++)
        {
            var t = _tiles[x, y].Type;
            if (t == TileType.Pellet || t == TileType.PowerPellet) count++;
        }
        return count;
    }

    public static Map CreateDefault(out Position pacmanStart, out Position[] ghostStarts)
    {
        // A small simple map, P = Pacman, G = Ghost, # = wall, . = pellet, o = power pellet
        string[] rows =
        {
            "####################",
            "#........##........#",
            "#.####...##...####.#",
            "#o#  #........#  #o#",
            "#.####.######.####.#",
            "#..................#",
            "#.####.##GG##.####.#",
            "#o.... .P  . .....o#",
            "####################"
        };
        var height = rows.Length;
        var width = rows[0].Length;
        var map = new Map(width, height);
        var ghosts = new List<Position>();
        pacmanStart = new Position(1, 1);
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                char c = rows[y][x];
                var p = new Position(x, y);
                switch (c)
                {
                    case '#': map._tiles[x, y] = new Tile(TileType.Wall); break;
                    case '.': map._tiles[x, y] = new Tile(TileType.Pellet); break;
                    case 'o': map._tiles[x, y] = new Tile(TileType.PowerPellet); break;
                    case 'P': pacmanStart = p; map._tiles[x, y] = new Tile(TileType.Empty); break;
                    case 'G': ghosts.Add(p); map._tiles[x, y] = new Tile(TileType.Empty); break;
                    default: map._tiles[x, y] = new Tile(TileType.Empty); break;
                }
            }
        }
        ghostStarts = ghosts.ToArray();
        return map;
    }

    public override string ToString()
    {
        var sb = new StringBuilder();
        for (var y = 0; y < Height; y++)
        {
            for (var x = 0; x < Width; x++)
            {
                sb.Append(_tiles[x, y].Type switch
                {
                    TileType.Wall => '#',
                    TileType.Pellet => '.',
                    TileType.PowerPellet => 'o',
                    _ => ' '
                });
            }
            sb.AppendLine();
        }
        return sb.ToString();
    }
}