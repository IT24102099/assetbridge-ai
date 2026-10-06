using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetBridge.Api.Models;

public class IncidentEvidence
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey(nameof(Incident))]
    public int IncidentId { get; set; }

    public Incident? Incident { get; set; }

    [Required]
    [MaxLength(1000)]
    public string FileUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string FileType { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
