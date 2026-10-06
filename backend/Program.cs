using AssetBridge.Backend.Data;
using AssetBridge.Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "AssetBridge AI — Member 3 (Maintenance & Quotation Management API)",
        Version = "v1",
        Description = "ASP.NET Core 8 Web API for Inspection, Quotation, Maintenance Planning, and AI Agent 3 Recommendation."
    });
});

// Configure CORS for React frontend & Flutter web/app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Database: PostgreSQL if connection string is configured, otherwise InMemory for zero-setup demo
var postgresConn = builder.Configuration.GetConnectionString("PostgreSqlConnection");
if (!string.IsNullOrEmpty(postgresConn))
{
    builder.Services.AddDbContext<AssetBridgeDbContext>(options =>
        options.UseNpgsql(postgresConn));
}
else
{
    builder.Services.AddDbContext<AssetBridgeDbContext>(options =>
        options.UseInMemoryDatabase("AssetBridgeDb"));
}

// Register Application Services
builder.Services.AddScoped<IComparisonService, ComparisonService>();
builder.Services.AddScoped<IAgent3RecommendationService, Agent3RecommendationService>();

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AssetBridgeDbContext>();
    DbInitializer.Initialize(context);
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AssetBridge AI Member 3 API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Health check root
app.MapGet("/", () => Results.Ok(new
{
    application = "AssetBridge AI — Member 3 Backend",
    component = "Maintenance Planning & Quotation Management",
    status = "Healthy",
    swaggerUrl = "/swagger",
    endpoints = new[]
    {
        "/api/Inspection",
        "/api/Quotation",
        "/api/Quotation/compare/INC-1021",
        "/api/Maintenance",
        "/api/Catalog",
        "/api/MaintenanceReport",
        "/api/Agent3/tools",
        "/api/Agent3/rag-search"
    }
}));

app.Run();
