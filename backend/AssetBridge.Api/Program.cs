using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using AssetBridge.Api.Data;
using AssetBridge.Api.Services;
using AssetBridge.Api.Agent.Rag;
using AssetBridge.Api.Agent.Services;
using AssetBridge.Api.Agent.Tools;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure PostgreSQL DbContext with Npgsql
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Register Application & Agent Services (DI)
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IIncidentService, IncidentService>();
builder.Services.AddSingleton<IKnowledgeBaseService, KnowledgeBaseService>();
builder.Services.AddScoped<IAgentToolRegistry, AgentToolRegistry>();
builder.Services.AddScoped<IIncidentPlanningAgent, IncidentPlanningAgent>();

// 3. Configure Controllers with JSON String Enum Converters
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 4. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 5. Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AssetBridge API",
        Version = "v1",
        Description = "Asset & Incident Management REST API for AssetBridge AI",
        Contact = new OpenApiContact
        {
            Name = "AssetBridge Team",
            Email = "support@assetbridge.ai"
        }
    });
});

var app = builder.Build();

// 6. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AssetBridge API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

// 7. Seed Initial Demonstration Data into PostgreSQL
await DbSeeder.SeedAsync(app.Services);

app.MapControllers();

app.Run();

public partial class Program { }

