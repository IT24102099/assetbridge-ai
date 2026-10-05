using AssetBridge.Api.Agent.Models;
using AssetBridge.Api.Agent.Rag;
using AssetBridge.Api.Agent.Tools;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Agent.Services;

public class IncidentPlanningAgent : IIncidentPlanningAgent
{
    private readonly IAgentToolRegistry _tools;
    private readonly IKnowledgeBaseService _knowledgeBase;
    private readonly ILogger<IncidentPlanningAgent> _logger;

    public IncidentPlanningAgent(
        IAgentToolRegistry tools,
        IKnowledgeBaseService knowledgeBase,
        ILogger<IncidentPlanningAgent> logger)
    {
        _tools = tools;
        _knowledgeBase = knowledgeBase;
        _logger = logger;
    }

    public List<AgentToolDefinition> GetCapabilities()
    {
        return _tools.GetToolDefinitions();
    }

    public async Task<IncidentPlanningResponse> PlanIncidentAsync(IncidentPlanningRequest request)
    {
        var toolLogs = new List<AgentToolCallLog>();

        // 1. Tool Call: GetIncident()
        var (incident, incLog) = await _tools.GetIncidentAsync(request.IncidentId);
        toolLogs.Add(incLog);

        // If not found in DB, construct fallback incident using request payload
        incident ??= new Incident
        {
            Id = request.IncidentId,
            AssetId = 1,
            Title = "Reported Facility Defect",
            Description = request.Description ?? "Operational malfunction requiring inspection.",
            Severity = request.Severity ?? IncidentSeverity.Medium,
            Status = IncidentStatus.Reported,
            Budget = request.Budget ?? 50000,
            PreferredDate = request.Deadline ?? DateTime.UtcNow.AddDays(3),
            CreatedAt = DateTime.UtcNow
        };

        // Override with any user-provided prompt parameters
        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            incident.Description = request.Description;
        }
        if (request.Severity.HasValue)
        {
            incident.Severity = request.Severity.Value;
        }
        if (request.Budget.HasValue)
        {
            incident.Budget = request.Budget.Value;
        }
        if (request.Deadline.HasValue)
        {
            incident.PreferredDate = request.Deadline.Value;
        }

        // 2. Tool Call: GetAsset()
        var (asset, assetLog) = await _tools.GetAssetAsync(incident.AssetId);
        toolLogs.Add(assetLog);

        asset ??= new Asset
        {
            Id = incident.AssetId,
            AssetCode = $"AST-{incident.AssetId:D3}",
            Name = "Municipal / Commercial Infrastructure Facility",
            Category = "General Infrastructure",
            Location = "Colombo, Western Province, Sri Lanka",
            Status = AssetStatus.Active
        };

        // 3. Tool Call: GetAssetHistory()
        var (histories, histLog) = await _tools.GetAssetHistoryAsync(asset.Id);
        toolLogs.Add(histLog);

        // 4. Tool Call: GetIncidentEvidence()
        var (evidences, evLog) = await _tools.GetIncidentEvidenceAsync(incident.Id);
        toolLogs.Add(evLog);

        // 5. RAG Retrieval from Maintenance Knowledge Base
        var ragQuery = $"{incident.Title} {incident.Description} {asset.Category} {asset.Name}";
        var retrievedDocs = await _knowledgeBase.RetrieveRelevantDocumentsAsync(ragQuery, topK: 3);

        // Extract immediate safety actions and standard operating procedures
        var immediateSafetyActions = retrievedDocs
            .SelectMany(d => d.ImmediateSafetyActions)
            .Distinct()
            .ToList();

        var sops = retrievedDocs
            .Select(d => $"[{d.Id}] {d.Title}: {d.Content}")
            .ToList();

        // 6. Risk Assessment
        var isEmergency = incident.Severity == IncidentSeverity.High || incident.Severity == IncidentSeverity.Critical;
        var safetyHazards = new List<string>();

        if (ragQuery.ToLower().Contains("water") || ragQuery.ToLower().Contains("leak") || ragQuery.ToLower().Contains("pipe"))
        {
            safetyHazards.Add("Slip hazard and potential electrical short-circuiting from standing water.");
            safetyHazards.Add("Structural plaster and concrete moisture degradation.");
        }
        if (ragQuery.ToLower().Contains("coolant") || ragQuery.ToLower().Contains("overheat") || ragQuery.ToLower().Contains("generator"))
        {
            safetyHazards.Add("Scalding risk from pressurized boiling coolant.");
            safetyHazards.Add("Total facility backup power blackout during critical operational hours.");
        }
        if (ragQuery.ToLower().Contains("gate") || ragQuery.ToLower().Contains("flood") || ragQuery.ToLower().Contains("drainage"))
        {
            safetyHazards.Add("Tidal seawater backflow inundating downstream residential units.");
            safetyHazards.Add("Hydraulic cylinder strain causing mechanical valve fracture.");
        }
        if (safetyHazards.Count == 0)
        {
            safetyHazards.Add("Unmonitored degradation may escalate repair costs and cause unexpected downtime.");
        }

        var risk = new IncidentRiskAssessment
        {
            RiskLevel = isEmergency ? "High / Critical Risk" : "Moderate Risk",
            SafetyHazards = safetyHazards,
            OperationalImpact = isEmergency
                ? "Immediate shutdown or localized disruption until verified contractor on-site."
                : "Partial degradation with minimal immediate continuity threat.",
            ContinuityThreat = isEmergency
        };

        // 7. Tool Call: CreateWorkflowPlan()
        var (steps, planLog) = _tools.CreateWorkflowPlan(
            incident,
            asset,
            histories,
            retrievedDocs,
            request.Deadline ?? incident.PreferredDate,
            request.Budget ?? incident.Budget);
        toolLogs.Add(planLog);

        // 8. Synthesize Objective and Recommendations
        var recommendedTrade = retrievedDocs.FirstOrDefault()?.RecommendedTrade ?? "Certified Maintenance Specialist";
        var objective = $"Orchestrate end-to-end resolution for incident #{incident.Id} ('{incident.Title}') at {asset.Name} ({asset.AssetCode}). " +
                        $"Triage damage, match vetted {recommendedTrade} in {asset.Location}, enforce human-in-the-loop owner approval, and verify physical repair.";

        var nextAction = immediateSafetyActions.Count > 0
            ? immediateSafetyActions[0]
            : $"Notify Local Representative in {asset.Location} to inspect {asset.AssetCode} and verify damage severity.";

        return new IncidentPlanningResponse
        {
            Objective = objective,
            Priority = incident.Severity.ToString().ToUpper(),
            IncidentId = incident.Id,
            AssetCode = asset.AssetCode,
            AssetName = asset.Name,
            Location = asset.Location,
            IdentifiedDefect = incident.Title,
            RequiredSpecialization = recommendedTrade,
            EstimatedBudget = request.Budget ?? incident.Budget,
            TargetDeadline = request.Deadline ?? incident.PreferredDate,
            RiskAnalysis = risk,
            RagKnowledge = new RagKnowledgeSummary
            {
                RetrievedDocuments = retrievedDocs,
                ImmediateSafetyActions = immediateSafetyActions,
                StandardOperatingProcedures = sops
            },
            ToolCallsExecuted = toolLogs,
            ExecutionPlan = steps,
            NextRecommendedAction = nextAction,
            GeneratedAt = DateTime.UtcNow
        };
    }
}
