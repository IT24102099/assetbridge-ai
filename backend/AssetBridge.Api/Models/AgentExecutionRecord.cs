using System.ComponentModel.DataAnnotations;

namespace AssetBridge.Api.Models;

public class AgentExecutionRecord
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string RunId { get; set; } = string.Empty;

    public int IncidentId { get; set; }

    [MaxLength(50)]
    public string AssetCode { get; set; } = string.Empty;

    [MaxLength(200)]
    public string AssetName { get; set; } = string.Empty;

    [Required]
    public string Objective { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Priority { get; set; } = string.Empty;

    [MaxLength(100)]
    public string RequiredSpecialization { get; set; } = string.Empty;

    public string? InputPayload { get; set; }

    public string? RetrievedRagDocs { get; set; }

    public string? ImmediateSafetyActions { get; set; }

    public string? ToolCallsAudit { get; set; }

    public string? ExecutionPlan { get; set; }

    public long ExecutionDurationMs { get; set; }

    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
}
