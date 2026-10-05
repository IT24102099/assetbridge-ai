using Xunit;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;
using AssetBridge.Tests.Helpers;

namespace AssetBridge.Tests.Services;

public class AssetServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateAsset_AndRecordHistory()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);
        var dto = new CreateAssetDto
        {
            AssetCode = "AST-TEST-001",
            Name = "Test Turbine Generator",
            Category = "Electrical & Power",
            Location = "Test Substation",
            Address = "123 Power Lane",
            Status = AssetStatus.Active,
            OwnerId = "ENG-001"
        };

        // Act
        var result = await service.CreateAsync(dto, "Admin User");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("AST-TEST-001", result.AssetCode);
        Assert.Equal("Test Turbine Generator", result.Name);
        Assert.Equal(AssetStatus.Active, result.Status);

        var savedAsset = await context.Assets.FindAsync(result.Id);
        Assert.NotNull(savedAsset);
        Assert.Equal("AST-TEST-001", savedAsset.AssetCode);

        var history = context.AssetHistories.FirstOrDefault(h => h.AssetId == result.Id);
        Assert.NotNull(history);
        Assert.Equal("Registered", history.EventType);
        Assert.Equal("Admin User", history.RecordedBy);
    }

    [Fact]
    public async Task CreateAsync_DuplicateCode_ShouldThrowInvalidOperationException()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);
        var dto1 = new CreateAssetDto
        {
            AssetCode = "AST-DUP-001",
            Name = "First Machine",
            Category = "Mechanical",
            Location = "Workshop A"
        };
        await service.CreateAsync(dto1);

        var dto2 = new CreateAssetDto
        {
            AssetCode = "AST-DUP-001", // Duplicate code
            Name = "Second Machine",
            Category = "Mechanical",
            Location = "Workshop B"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(dto2));
    }

    [Fact]
    public async Task GetAllAsync_WithCategoryAndStatusFilter_ShouldReturnMatchingAssets()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);

        await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-WAT-01",
            Name = "Water Pump 1",
            Category = "Water & Sanitation",
            Location = "Pump House 1",
            Status = AssetStatus.Active
        });
        await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-WAT-02",
            Name = "Water Pump 2",
            Category = "Water & Sanitation",
            Location = "Pump House 2",
            Status = AssetStatus.Maintenance
        });
        await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-ELE-01",
            Name = "Transformer 1",
            Category = "Electrical & Power",
            Location = "Yard 1",
            Status = AssetStatus.Active
        });

        // Act
        var waterActive = await service.GetAllAsync(category: "Water & Sanitation", status: AssetStatus.Active);
        var allWater = await service.GetAllAsync(category: "Water & Sanitation");
        var searchResult = await service.GetAllAsync(search: "Transformer");

        // Assert
        Assert.Single(waterActive);
        Assert.Equal("AST-WAT-01", waterActive.First().AssetCode);

        Assert.Equal(2, allWater.Count());
        Assert.Single(searchResult);
        Assert.Equal("AST-ELE-01", searchResult.First().AssetCode);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ShouldReturnAssetWithHistory()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);
        var created = await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-HIST-001",
            Name = "Inspection Pump",
            Category = "Water & Sanitation",
            Location = "Dockyard",
            Status = AssetStatus.Active
        });

        // Act
        var result = await service.GetByIdAsync(created.Id, includeHistory: true);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("AST-HIST-001", result.AssetCode);
        Assert.NotNull(result.Histories);
        Assert.NotEmpty(result.Histories);
        Assert.Equal("Registered", result.Histories.First().EventType);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateAssetDetails_AndRecordStatusHistory()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);
        var created = await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-UPD-001",
            Name = "Initial Name",
            Category = "Civil",
            Location = "Old Site",
            Status = AssetStatus.Active
        });

        var updateDto = new UpdateAssetDto
        {
            Name = "Updated Name",
            Category = "Civil",
            Location = "Upgraded Site",
            Status = AssetStatus.Maintenance
        };

        // Act
        var updated = await service.UpdateAsync(created.Id, updateDto, "Inspector Wickrama");

        // Assert
        Assert.NotNull(updated);
        Assert.Equal("Updated Name", updated.Name);
        Assert.Equal("Upgraded Site", updated.Location);
        Assert.Equal(AssetStatus.Maintenance, updated.Status);

        var statusHistory = context.AssetHistories
            .Where(h => h.AssetId == created.Id && h.EventType == "StatusChanged")
            .FirstOrDefault();
        Assert.NotNull(statusHistory);
        Assert.Contains("Maintenance", statusHistory.Description);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveAssetFromDatabase()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var service = new AssetService(context);
        var created = await service.CreateAsync(new CreateAssetDto
        {
            AssetCode = "AST-DEL-001",
            Name = "Decommissioned Line",
            Category = "Telecommunication",
            Location = "Tower Hill"
        });

        // Act
        var success = await service.DeleteAsync(created.Id);

        // Assert
        Assert.True(success);
        var found = await service.GetByIdAsync(created.Id);
        Assert.Null(found);
    }
}
