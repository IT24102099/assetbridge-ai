using System.ComponentModel.DataAnnotations;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Agent.Models;

public class IncidentPlanningRequest
{
    [Required]
    public int IncidentId { get; set; }

    public string? Description { get; set; }

    public IncidentSeverity? Severity { get; set; }

    public decimal? Budget { get; set; }

    public DateTime? Deadline { get; set; }
}
