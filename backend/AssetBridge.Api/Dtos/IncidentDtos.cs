using System.ComponentModel.DataAnnotations;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Dtos;

public class IncidentDto
{
    public int Id { get; set; }
    public int AssetId { get; set; }
    public string? AssetCode { get; set; }
    public string? AssetName { get; set; }
    public string? AssetLocation { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IncidentSeverity Severity { get; set; }
    public IncidentStatus Status { get; set; }
    public decimal? Budget { get; set; }
    public DateTime? PreferredDate { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<IncidentEvidenceDto> Evidences { get; set; } = new();
}

public class CreateIncidentDto
{
    [Required]
    public int AssetId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public IncidentSeverity Severity { get; set; } = IncidentSeverity.Medium;

    public decimal? Budget { get; set; }

    public DateTime? PreferredDate { get; set; }

    [MaxLength(1000)]
    public string? PhotoUrl { get; set; }

    [MaxLength(100)]
    public string? ReportedBy { get; set; }
}

public class UpdateIncidentDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public IncidentSeverity Severity { get; set; }

    public decimal? Budget { get; set; }

    public DateTime? PreferredDate { get; set; }

    [MaxLength(1000)]
    public string? PhotoUrl { get; set; }
}

public class UpdateIncidentStatusDto
{
    [Required]
    public IncidentStatus Status { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [MaxLength(100)]
    public string? UpdatedBy { get; set; }
}

public class IncidentEvidenceDto
{
    public int Id { get; set; }
    public int IncidentId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}

public class AddIncidentEvidenceDto
{
    [Required]
    [MaxLength(1000)]
    public string FileUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string FileType { get; set; } = string.Empty;
}
