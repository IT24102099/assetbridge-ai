using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AssetBridge.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AssetStatus
{
    Active,
    Maintenance,
    Decommissioned
}

public class Asset
{
    [Key]
    public int Id { get; set; }

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

    [Required]
    public AssetStatus Status { get; set; } = AssetStatus.Active;

    [MaxLength(100)]
    public string? OwnerId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();
    public ICollection<AssetHistory> Histories { get; set; } = new List<AssetHistory>();
}
