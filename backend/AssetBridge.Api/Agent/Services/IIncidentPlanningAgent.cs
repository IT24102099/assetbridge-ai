using AssetBridge.Api.Agent.Models;

namespace AssetBridge.Api.Agent.Services;

public interface IIncidentPlanningAgent
{
    Task<IncidentPlanningResponse> PlanIncidentAsync(IncidentPlanningRequest request);
    List<AgentToolDefinition> GetCapabilities();
}
