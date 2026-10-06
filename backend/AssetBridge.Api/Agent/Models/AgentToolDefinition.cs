namespace AssetBridge.Api.Agent.Models;

public class AgentToolDefinition
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, string> Parameters { get; set; } = new();
}

public class AgentToolCallLog
{
    public string ToolName { get; set; } = string.Empty;
    public object? Arguments { get; set; }
    public object? OutputSummary { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public bool Success { get; set; } = true;
}
