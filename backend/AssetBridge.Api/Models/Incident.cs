using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AssetBridge.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum IncidentSeverity
{
    Low,
    Medium,
    High,
    Critical
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum IncidentStatus
{
    Reported,
    UnderReview,
    InProgress,
    Resolved,
    Closed
}

public class Incident
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey(nameof(Asset))]
    public int AssetId { get; set; }

    public Asset? Asset { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public IncidentSeverity Severity { get; set; } = IncidentSeverity.Medium;

    [Required]
    public IncidentStatus Status { get; set; } = IncidentStatus.Reported;

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Budget { get; set; }

    public DateTime? PreferredDate { get; set; }

    [MaxLength(1000)]
    public string? PhotoUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    public ICollection<IncidentEvidence> Evidences { get; set; } = new List<IncidentEvidence>();
}
