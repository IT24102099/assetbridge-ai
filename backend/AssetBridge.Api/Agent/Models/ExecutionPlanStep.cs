namespace AssetBridge.Api.Agent.Models;

public class ExecutionPlanStep
{
    public int StepNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AssignedComponent { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public string EstimatedDuration { get; set; } = string.Empty;
    public List<int> Dependencies { get; set; } = new();
}
