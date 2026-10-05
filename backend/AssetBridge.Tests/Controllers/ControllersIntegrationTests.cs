using System.Net;
using System.Net.Http.Json;
using Xunit;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Tests.Helpers;

namespace AssetBridge.Tests.Controllers;

public class ControllersIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ControllersIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAssets_Endpoint_ShouldReturn200Ok()
    {
        // Act
        var response = await _client.GetAsync("/api/assets");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var assets = await response.Content.ReadFromJsonAsync<List<AssetDto>>();
        Assert.NotNull(assets);
    }

    [Fact]
    public async Task PostAsset_ValidPayload_ShouldReturn201Created()
    {
        // Arrange
        var newAsset = new CreateAssetDto
        {
            AssetCode = $"AST-INT-{Guid.NewGuid():N}"[..12].ToUpper(),
            Name = "Integration Test Water Chiller",
            Category = "HVAC & Cooling",
            Location = "Central Air Plant, Colombo 03",
            Address = "Kollupitiya Junction",
            Coordinates = "6.9147° N, 79.8532° E",
            Status = AssetStatus.Active,
            OwnerId = "USR-INT-001"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/assets", newAsset);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<AssetDto>();
        Assert.NotNull(created);
        Assert.Equal(newAsset.AssetCode, created.AssetCode);
        Assert.Equal(newAsset.Name, created.Name);
        Assert.True(created.Id > 0);

        // Verify retrieval via GET /api/assets/{id}
        var getResponse = await _client.GetAsync($"/api/assets/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetched = await getResponse.Content.ReadFromJsonAsync<AssetDto>();
        Assert.NotNull(fetched);
        Assert.Equal(created.Id, fetched.Id);
    }

    [Fact]
    public async Task GetIncidents_Endpoint_ShouldReturn200Ok()
    {
        // Act
        var response = await _client.GetAsync("/api/incidents");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var incidents = await response.Content.ReadFromJsonAsync<List<IncidentDto>>();
        Assert.NotNull(incidents);
    }

    [Fact]
    public async Task PostIncident_ValidPayload_ShouldReturn201Created_WithInitialStatusReported()
    {
        // Arrange: Create asset first to link incident
        var assetDto = new CreateAssetDto
        {
            AssetCode = $"AST-REL-{Guid.NewGuid():N}"[..12].ToUpper(),
            Name = "Transformer Unit A",
            Category = "Electrical & Power",
            Location = "Kelaniya Grid Substation",
            Status = AssetStatus.Active
        };
        var assetResponse = await _client.PostAsJsonAsync("/api/assets", assetDto);
        var asset = await assetResponse.Content.ReadFromJsonAsync<AssetDto>();
        Assert.NotNull(asset);

        var newIncident = new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = "Transformer Oil Leak",
            Description = "Dielectric oil seepage observed around cooling fins",
            Severity = IncidentSeverity.High,
            Budget = 95000,
            PhotoUrl = "https://images.unsplash.com/photo-1581092335397-9583fe92d232",
            ReportedBy = "Inspector Silva"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/incidents", newIncident);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<IncidentDto>();
        Assert.NotNull(created);
        Assert.Equal(newIncident.Title, created.Title);
        Assert.Equal(IncidentStatus.Reported, created.Status); // Initial status must be 'Reported'
        Assert.Equal(IncidentSeverity.High, created.Severity);
        Assert.Equal(95000, created.Budget);
        Assert.True(created.Id > 0);

        // Verify retrieval via GET /api/incidents/{id}
        var getResponse = await _client.GetAsync($"/api/incidents/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetched = await getResponse.Content.ReadFromJsonAsync<IncidentDto>();
        Assert.NotNull(fetched);
        Assert.Equal(created.Id, fetched.Id);
    }
}
