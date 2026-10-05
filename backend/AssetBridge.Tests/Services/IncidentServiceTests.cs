using Xunit;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;
using AssetBridge.Tests.Helpers;

namespace AssetBridge.Tests.Services;

public class IncidentServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateIncidentWithStatusReported_AndRecordEvidence()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var assetService = new AssetService(context);
        var incidentService = new IncidentService(context);

        var asset = await assetService.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-INC-001",
            Name = "Colombo Central Pump",
            Category = "Water & Sanitation",
            Location = "Maligawatta",
            Status = AssetStatus.Active
        });

        var createDto = new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = "Valve Leakage",
            Description = "Water leaking from main valve",
            Severity = IncidentSeverity.Medium,
            Budget = 45000,
            PhotoUrl = "https://example.com/leak.jpg",
            ReportedBy = "Tech Silva"
        };

        // Act
        var result = await incidentService.CreateAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Valve Leakage", result.Title);
        Assert.Equal(IncidentStatus.Reported, result.Status); // Explicit requirement: initial status 'Reported'
        Assert.Equal(IncidentSeverity.Medium, result.Severity);
        Assert.Equal(45000, result.Budget);
        Assert.Single(result.Evidences);

        var history = context.AssetHistories
            .FirstOrDefault(h => h.AssetId == asset.Id && h.EventType == "IncidentReported");
        Assert.NotNull(history);
        Assert.Contains("Reported", history.Description);
    }

    [Fact]
    public async Task CreateAsync_CriticalSeverity_ShouldAutoTransitionAssetToMaintenance()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var assetService = new AssetService(context);
        var incidentService = new IncidentService(context);

        var asset = await assetService.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-CRIT-001",
            Name = "Peradeniya Generator",
            Category = "Electrical & Power",
            Location = "Substation",
            Status = AssetStatus.Active
        });

        var createDto = new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = "Starter Motor Burnout",
            Description = "Severe electrical short in starter motor",
            Severity = IncidentSeverity.Critical,
            Budget = 150000
        };

        // Act
        var incident = await incidentService.CreateAsync(createDto);

        // Assert
        Assert.Equal(IncidentSeverity.Critical, incident.Severity);

        // Verify that asset was transitioned to Maintenance automatically
        var refreshedAsset = await context.Assets.FindAsync(asset.Id);
        Assert.NotNull(refreshedAsset);
        Assert.Equal(AssetStatus.Maintenance, refreshedAsset.Status);
    }

    [Fact]
    public async Task CreateAsync_NonExistentAsset_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var incidentService = new IncidentService(context);

        var createDto = new CreateIncidentDto
        {
            AssetId = 99999, // Does not exist
            Title = "Phantom Defect",
            Description = "Missing asset incident",
            Severity = IncidentSeverity.Low
        };

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => incidentService.CreateAsync(createDto));
    }

    [Fact]
    public async Task UpdateStatusAsync_ShouldProgressLifecycle_AndRecordAuditLog()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var assetService = new AssetService(context);
        var incidentService = new IncidentService(context);

        var asset = await assetService.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-STAT-001",
            Name = "Sluice Gate Control",
            Category = "Civil",
            Location = "Galle Fort"
        });

        var incident = await incidentService.CreateAsync(new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = "Gate Jammed",
            Description = "Debris blocking hydraulic gate",
            Severity = IncidentSeverity.High
        });

        var updateDto = new UpdateIncidentStatusDto
        {
            Status = IncidentStatus.InProgress,
            Notes = "Contractor dispatched to site",
            UpdatedBy = "Coordinator Perera"
        };

        // Act
        var updated = await incidentService.UpdateStatusAsync(incident.Id, updateDto);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal(IncidentStatus.InProgress, updated.Status);

        var history = context.AssetHistories
            .FirstOrDefault(h => h.AssetId == asset.Id && h.EventType == "IncidentStatusUpdated");
        Assert.NotNull(history);
        Assert.Contains("InProgress", history.Description);
    }

    [Fact]
    public async Task AddEvidenceAsync_ShouldAttachInspectionPhotos()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var assetService = new AssetService(context);
        var incidentService = new IncidentService(context);

        var asset = await assetService.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-EVD-001",
            Name = "Solar Inverter",
            Category = "Renewable Energy",
            Location = "Jaffna Solar Farm"
        });

        var incident = await incidentService.CreateAsync(new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = "Inverter Overheating",
            Description = "Heat sink clogged with dust",
            Severity = IncidentSeverity.Medium
        });

        var evidenceDto = new AddIncidentEvidenceDto
        {
            FileUrl = "https://example.com/solar-inverter-thermal.jpg",
            FileType = "image/jpeg"
        };

        // Act
        var evidence = await incidentService.AddEvidenceAsync(incident.Id, evidenceDto);

        // Assert
        Assert.NotNull(evidence);
        Assert.Equal("https://example.com/solar-inverter-thermal.jpg", evidence.FileUrl);

        var stored = await incidentService.GetByIdAsync(incident.Id);
        Assert.NotNull(stored);
        Assert.Contains(stored.Evidences, e => e.FileUrl == evidenceDto.FileUrl);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public async Task CreateAsync_EmptyOrNullTitle_ShouldThrowArgumentException(string? invalidTitle)
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var incidentService = new IncidentService(context);

        var createDto = new CreateIncidentDto
        {
            AssetId = 1,
            Title = invalidTitle!,
            Description = "Valid defect description",
            Severity = IncidentSeverity.Low
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => incidentService.CreateAsync(createDto));
    }

    [Fact]
    public async Task CreateAsync_NegativeBudget_ShouldThrowArgumentException()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var incidentService = new IncidentService(context);

        var createDto = new CreateIncidentDto
        {
            AssetId = 1,
            Title = "Valid Defect",
            Description = "Valid defect description",
            Severity = IncidentSeverity.Low,
            Budget = -500 // Negative budget not permitted
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => incidentService.CreateAsync(createDto));
        Assert.Contains("budget cannot be negative", ex.Message);
    }

    [Theory]
    [InlineData(IncidentSeverity.Low)]
    [InlineData(IncidentSeverity.Medium)]
    [InlineData(IncidentSeverity.High)]
    [InlineData(IncidentSeverity.Critical)]
    public async Task CreateAsync_SeverityHandling_ShouldAssignAllSeveritiesCorrectly(IncidentSeverity severity)
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var assetService = new AssetService(context);
        var incidentService = new IncidentService(context);

        var asset = await assetService.CreateAsync(new CreateAssetDto
        {
            AssetCode = $"AST-SEV-{severity}",
            Name = "Sever Test Machine",
            Category = "Electrical",
            Location = "Workshop"
        });

        var createDto = new CreateIncidentDto
        {
            AssetId = asset.Id,
            Title = $"Issue for {severity}",
            Description = "Severity assignment test",
            Severity = severity,
            Budget = 10000
        };

        // Act
        var result = await incidentService.CreateAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(severity, result.Severity);
        Assert.Equal(IncidentStatus.Reported, result.Status);
    }
}

