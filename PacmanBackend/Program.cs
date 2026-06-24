using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Interactive Menu");
        Console.WriteLine("1. Start Game");
        Console.WriteLine("2. Show High Scores");
        Console.WriteLine("3. Quit");

        if (args.Length == 0)
        {
            Console.WriteLine("No input was provided. Exiting...");
            return;
        }

        switch (args[0])
        {
            case "1":
                Console.WriteLine("Starting Game...");
                break;
            case "2":
                Console.WriteLine("High Scores:");
                Console.WriteLine("1. John - 1500\n2. Alice - 1200\n3. Bob - 800");
                break;
            case "3":
                Console.WriteLine("Quitting...");
                break;
            default:
                Console.WriteLine("Invalid choice. Please select between 1 and 3.");
                break;
        }
    }
}