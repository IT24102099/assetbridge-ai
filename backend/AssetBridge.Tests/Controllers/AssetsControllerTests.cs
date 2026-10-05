using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using AssetBridge.Api.Controllers;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;

namespace AssetBridge.Tests.Controllers;

public class AssetsControllerTests
{
    private readonly Mock<IAssetService> _mockAssetService;
    private readonly Mock<ILogger<AssetsController>> _mockLogger;
    private readonly AssetsController _controller;

    public AssetsControllerTests()
    {
        _mockAssetService = new Mock<IAssetService>();
        _mockLogger = new Mock<ILogger<AssetsController>>();
        _controller = new AssetsController(_mockAssetService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturn200Ok_WithListOfAssets()
    {
        // Arrange
        var mockAssets = new List<AssetDto>
        {
            new() { Id = 1, AssetCode = "AST-001", Name = "Pump #1", Status = AssetStatus.Active },
            new() { Id = 2, AssetCode = "AST-002", Name = "Generator #2", Status = AssetStatus.Maintenance }
        };
        _mockAssetService.Setup(s => s.GetAllAsync(null, null, null))
            .ReturnsAsync(mockAssets);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedAssets = Assert.IsAssignableFrom<IEnumerable<AssetDto>>(okResult.Value);
        Assert.Equal(2, returnedAssets.Count());
    }

    [Fact]
    public async Task GetById_ExistingId_ShouldReturn200Ok()
    {
        // Arrange
        var assetDto = new AssetDto
        {
            Id = 1,
            AssetCode = "AST-001",
            Name = "Water Pump",
            Status = AssetStatus.Active
        };
        _mockAssetService.Setup(s => s.GetByIdAsync(1, false))
            .ReturnsAsync(assetDto);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<AssetDto>(okResult.Value);
        Assert.Equal("AST-001", returned.AssetCode);
    }

    [Fact]
    public async Task GetById_NonExistingId_ShouldReturn404NotFound()
    {
        // Arrange
        _mockAssetService.Setup(s => s.GetByIdAsync(999, false))
            .ReturnsAsync((AssetDto?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_ValidDto_ShouldReturn201Created()
    {
        // Arrange
        var createDto = new CreateAssetDto
        {
            AssetCode = "AST-NEW-01",
            Name = "New Substation",
            Category = "Electrical",
            Location = "Colombo Yard"
        };
        var createdDto = new AssetDto
        {
            Id = 10,
            AssetCode = "AST-NEW-01",
            Name = "New Substation",
            Category = "Electrical",
            Location = "Colombo Yard",
            Status = AssetStatus.Active
        };
        _mockAssetService.Setup(s => s.CreateAsync(createDto, null))
            .ReturnsAsync(createdDto);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(AssetsController.GetById), createdAtResult.ActionName);
        Assert.Equal(10, createdAtResult.RouteValues?["id"]);
    }

    [Fact]
    public async Task Delete_ExistingAsset_ShouldReturn204NoContent()
    {
        // Arrange
        _mockAssetService.Setup(s => s.DeleteAsync(1))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_NonExistingAsset_ShouldReturn404NotFound()
    {
        // Arrange
        _mockAssetService.Setup(s => s.DeleteAsync(999))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
