using AssetBridge.Api.Agent.Models;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Agent.Tools;

public interface IAgentToolRegistry
{
    List<AgentToolDefinition> GetToolDefinitions();

    Task<(Asset? Asset, AgentToolCallLog Log)> GetAssetAsync(int assetId);

    Task<(Incident? Incident, AgentToolCallLog Log)> GetIncidentAsync(int incidentId);

    Task<(List<AssetHistory> Histories, AgentToolCallLog Log)> GetAssetHistoryAsync(int assetId);

    Task<(List<IncidentEvidence> Evidences, AgentToolCallLog Log)> GetIncidentEvidenceAsync(int incidentId);

    (List<ExecutionPlanStep> Steps, AgentToolCallLog Log) CreateWorkflowPlan(
        Incident incident,
        Asset asset,
        List<AssetHistory> history,
        List<KnowledgeDocument> ragDocs,
        DateTime? deadline,
        decimal? budget);
}
