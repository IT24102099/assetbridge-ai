using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetBridge.Api.Models;

public class AssetHistory
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey(nameof(Asset))]
    public int AssetId { get; set; }

    public Asset? Asset { get; set; }

    [Required]
    [MaxLength(100)]
    public string EventType { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public DateTime Date { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? RecordedBy { get; set; }
}
