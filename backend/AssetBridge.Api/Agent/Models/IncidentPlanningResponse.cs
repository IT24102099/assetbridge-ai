namespace AssetBridge.Api.Agent.Models;

public class IncidentPlanningResponse
{
    public string Objective { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public int IncidentId { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string IdentifiedDefect { get; set; } = string.Empty;
    public string RequiredSpecialization { get; set; } = string.Empty;
    public decimal? EstimatedBudget { get; set; }
    public DateTime? TargetDeadline { get; set; }
    public IncidentRiskAssessment RiskAnalysis { get; set; } = new();
    public RagKnowledgeSummary RagKnowledge { get; set; } = new();
    public List<AgentToolCallLog> ToolCallsExecuted { get; set; } = new();
    public List<ExecutionPlanStep> ExecutionPlan { get; set; } = new();
    public string NextRecommendedAction { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

public class IncidentRiskAssessment
{
    public string RiskLevel { get; set; } = "Medium";
    public List<string> SafetyHazards { get; set; } = new();
    public string OperationalImpact { get; set; } = string.Empty;
    public bool ContinuityThreat { get; set; }
}

public class RagKnowledgeSummary
{
    public List<KnowledgeDocument> RetrievedDocuments { get; set; } = new();
    public List<string> ImmediateSafetyActions { get; set; } = new();
    public List<string> StandardOperatingProcedures { get; set; } = new();
}
