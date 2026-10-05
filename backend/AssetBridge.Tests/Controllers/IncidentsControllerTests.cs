using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using AssetBridge.Api.Controllers;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;

namespace AssetBridge.Tests.Controllers;

public class IncidentsControllerTests
{
    private readonly Mock<IIncidentService> _mockIncidentService;
    private readonly Mock<ILogger<IncidentsController>> _mockLogger;
    private readonly IncidentsController _controller;

    public IncidentsControllerTests()
    {
        _mockIncidentService = new Mock<IIncidentService>();
        _mockLogger = new Mock<ILogger<IncidentsController>>();
        _controller = new IncidentsController(_mockIncidentService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturn200Ok_WithIncidents()
    {
        // Arrange
        var mockIncidents = new List<IncidentDto>
        {
            new() { Id = 1, Title = "Defect 1", Status = IncidentStatus.Reported, Severity = IncidentSeverity.High },
            new() { Id = 2, Title = "Defect 2", Status = IncidentStatus.InProgress, Severity = IncidentSeverity.Medium }
        };
        _mockIncidentService.Setup(s => s.GetAllAsync(null, null, null, null))
            .ReturnsAsync(mockIncidents);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var incidents = Assert.IsAssignableFrom<IEnumerable<IncidentDto>>(okResult.Value);
        Assert.Equal(2, incidents.Count());
    }

    [Fact]
    public async Task GetById_ExistingIncident_ShouldReturn200Ok()
    {
        // Arrange
        var mockIncident = new IncidentDto
        {
            Id = 1,
            Title = "Riser Leak",
            Status = IncidentStatus.Reported,
            Severity = IncidentSeverity.High
        };
        _mockIncidentService.Setup(s => s.GetByIdAsync(1))
            .ReturnsAsync(mockIncident);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<IncidentDto>(okResult.Value);
        Assert.Equal(1, returned.Id);
        Assert.Equal("Riser Leak", returned.Title);
    }

    [Fact]
    public async Task GetById_NonExistingIncident_ShouldReturn404NotFound()
    {
        // Arrange
        _mockIncidentService.Setup(s => s.GetByIdAsync(999))
            .ReturnsAsync((IncidentDto?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_ValidDto_ShouldReturn201Created()
    {
        // Arrange
        var createDto = new CreateIncidentDto
        {
            AssetId = 1,
            Title = "High Pressure Valve Defect",
            Description = "Water leakage observed",
            Severity = IncidentSeverity.High,
            Budget = 85000
        };

        var createdDto = new IncidentDto
        {
            Id = 10,
            AssetId = 1,
            Title = "High Pressure Valve Defect",
            Status = IncidentStatus.Reported,
            Severity = IncidentSeverity.High,
            Budget = 85000
        };

        _mockIncidentService.Setup(s => s.CreateAsync(createDto))
            .ReturnsAsync(createdDto);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(IncidentsController.GetById), createdAtResult.ActionName);
        Assert.Equal(10, createdAtResult.RouteValues?["id"]);
    }

    [Fact]
    public async Task UpdateStatus_ValidStatus_ShouldReturn200Ok()
    {
        // Arrange
        var statusDto = new UpdateIncidentStatusDto
        {
            Status = IncidentStatus.InProgress,
            Notes = "Field team dispatched"
        };

        var updatedDto = new IncidentDto
        {
            Id = 1,
            Status = IncidentStatus.InProgress,
            Title = "High Pressure Valve Defect"
        };

        _mockIncidentService.Setup(s => s.UpdateStatusAsync(1, statusDto))
            .ReturnsAsync(updatedDto);

        // Act
        var result = await _controller.UpdateStatus(1, statusDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<IncidentDto>(okResult.Value);
        Assert.Equal(IncidentStatus.InProgress, returned.Status);
    }
}
