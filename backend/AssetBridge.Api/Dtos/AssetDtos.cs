using System.ComponentModel.DataAnnotations;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Dtos;

public class AssetDto
{
    public int Id { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Coordinates { get; set; }
    public AssetStatus Status { get; set; }
    public string? OwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int ActiveIncidentsCount { get; set; }
    public List<AssetHistoryDto>? Histories { get; set; }
}

public class CreateAssetDto
{
    [Required]
    [MaxLength(50)]
    public string AssetCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? Coordinates { get; set; }

    public AssetStatus Status { get; set; } = AssetStatus.Active;

    [MaxLength(100)]
    public string? OwnerId { get; set; }
}

public class UpdateAssetDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? Coordinates { get; set; }

    public AssetStatus Status { get; set; }

    [MaxLength(100)]
    public string? OwnerId { get; set; }
}

public class AssetHistoryDto
{
    public int Id { get; set; }
    public int AssetId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string? RecordedBy { get; set; }
}

public class CreateAssetHistoryDto
{
    [Required]
    [MaxLength(100)]
    public string EventType { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? RecordedBy { get; set; }
}
