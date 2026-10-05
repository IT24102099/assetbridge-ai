namespace AssetBridge.Api.Agent.Models;

public class KnowledgeDocument
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Keywords { get; set; } = new();
    public List<string> ImmediateSafetyActions { get; set; } = new();
    public string RecommendedTrade { get; set; } = string.Empty;
    public double RelevanceScore { get; set; }
}
