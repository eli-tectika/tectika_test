var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// Fallback to index.html for any unknown route (simple client-side routing support)
app.MapFallbackToFile("index.html");

app.Run();
