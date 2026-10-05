using AssetBridge.Api.Agent.Models;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Agent.Services;

public interface IIncidentPlanningAgent
{
    Task<IncidentPlanningResponse> PlanIncidentAsync(IncidentPlanningRequest request);
    List<AgentToolDefinition> GetCapabilities();
    Task<List<AgentExecutionRecord>> GetExecutionLogsAsync(int? incidentId = null);
    Task<AgentExecutionRecord?> GetExecutionLogByIdAsync(int id);
}
