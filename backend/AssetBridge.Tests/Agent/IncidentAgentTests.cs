using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using AssetBridge.Api.Agent.Models;
using AssetBridge.Api.Agent.Rag;
using AssetBridge.Api.Agent.Services;
using AssetBridge.Api.Agent.Tools;
using AssetBridge.Api.Data;
using AssetBridge.Api.Models;
using AssetBridge.Tests.Helpers;

namespace AssetBridge.Tests.Agent;

public class IncidentAgentTests
{
    private readonly AppDbContext _context;
    private readonly IncidentPlanningAgent _agent;
    private readonly AgentToolRegistry _toolRegistry;
    private readonly KnowledgeBaseService _knowledgeBase;

    public IncidentAgentTests()
    {
        _context = TestDbContextFactory.Create();
        var agentLogger = new Mock<ILogger<IncidentPlanningAgent>>();

        // Seed sample asset and incident so tool calls find them
        var asset = new Asset
        {
            Id = 1,
            AssetCode = "AST-CMB-001",
            Name = "Colombo Central Water Pump #4",
            Category = "Water & Sanitation",
            Location = "Maligawatta Pumping Station, Colombo 10",
            Status = AssetStatus.Active,
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        var incident = new Incident
        {
            Id = 1,
            AssetId = 1,
            Title = "Severe residential water leakage",
            Description = "Severe residential water leakage detected in basement riser pipe flooding mechanical room",
            Severity = IncidentSeverity.High,
            Status = IncidentStatus.Reported,
            Budget = 85000,
            PreferredDate = DateTime.UtcNow.AddDays(2),
            CreatedAt = DateTime.UtcNow
        };

        _context.Assets.Add(asset);
        _context.Incidents.Add(incident);
        _context.AssetHistories.Add(new AssetHistory
        {
            AssetId = 1,
            EventType = "Registered",
            Description = "Commissioned",
            Date = DateTime.UtcNow.AddMonths(-3)
        });
        _context.IncidentEvidences.Add(new IncidentEvidence
        {
            IncidentId = 1,
            FileUrl = "https://example.com/leak.jpg",
            FileType = "image/jpeg",
            UploadedAt = DateTime.UtcNow
        });
        _context.SaveChanges();

        _toolRegistry = new AgentToolRegistry(_context);
        _knowledgeBase = new KnowledgeBaseService();
        _agent = new IncidentPlanningAgent(_toolRegistry, _knowledgeBase, _context, agentLogger.Object);
    }

    [Fact]
    public void GetCapabilities_ShouldReturnFiveStandardTools()
    {
        // Act
        var capabilities = _agent.GetCapabilities();

        // Assert
        Assert.NotNull(capabilities);
        Assert.Equal(5, capabilities.Count);

        var toolNames = capabilities.Select(t => t.Name).ToList();
        Assert.Contains("GetAsset", toolNames);
        Assert.Contains("GetIncident", toolNames);
        Assert.Contains("GetAssetHistory", toolNames);
        Assert.Contains("GetIncidentEvidence", toolNames);
        Assert.Contains("CreateWorkflowPlan", toolNames);
    }

    [Fact]
    public async Task PlanIncidentAsync_WaterLeakage_ShouldRetrievePlumbingRAG_AndGenerateStructuredPlan()
    {
        // Arrange
        var request = new IncidentPlanningRequest
        {
            IncidentId = 1,
            Description = "Severe residential water leakage detected in basement riser pipe flooding mechanical room",
            Severity = IncidentSeverity.High,
            Budget = 85000,
            Deadline = DateTime.UtcNow.AddDays(2)
        };

        // Act
        var plan = await _agent.PlanIncidentAsync(request);

        // Assert: 1. Structured Plan Base properties
        Assert.NotNull(plan);
        Assert.Equal(1, plan.IncidentId);
        Assert.Contains("Orchestrate end-to-end resolution", plan.Objective);
        Assert.Equal("HIGH", plan.Priority);
        Assert.Contains("Licensed Commercial & Residential Plumber", plan.RequiredSpecialization);

        // Assert: 2. RAG Retrieval validation
        Assert.NotNull(plan.RagKnowledge);
        Assert.NotEmpty(plan.RagKnowledge.RetrievedDocuments);
        Assert.Contains(plan.RagKnowledge.RetrievedDocuments, doc => doc.Id == "DOC-PLUMB-01");
        Assert.NotEmpty(plan.RagKnowledge.ImmediateSafetyActions);
        Assert.Contains(plan.RagKnowledge.ImmediateSafetyActions, action => action.Contains("shut off the primary intake"));

        // Assert: 3. Tool Calls Executed
        Assert.NotNull(plan.ToolCallsExecuted);
        Assert.Equal(5, plan.ToolCallsExecuted.Count);
        Assert.All(plan.ToolCallsExecuted, log => Assert.True(log.Success));

        // Assert: 4. Multi-Step Execution Plan across 4 Member Components
        Assert.NotNull(plan.ExecutionPlan);
        Assert.Equal(6, plan.ExecutionPlan.Count);

        Assert.Equal("Member 1: Asset & Incident Management", plan.ExecutionPlan[0].AssignedComponent);
        Assert.Equal("Member 2: Provider Representative Coordination", plan.ExecutionPlan[1].AssignedComponent);
        Assert.Equal("Member 3: Maintenance & Quotation Management", plan.ExecutionPlan[2].AssignedComponent);
        Assert.Equal("Member 3: Maintenance & Cost Recommendation Agent", plan.ExecutionPlan[3].AssignedComponent);
        Assert.Equal("Member 4: Approval & Workflow Continuity", plan.ExecutionPlan[4].AssignedComponent);
        Assert.Equal("Member 4: Validation & Continuity Agent", plan.ExecutionPlan[5].AssignedComponent);
    }

    [Fact]
    public async Task PlanIncidentAsync_WaterLeakInKitchen_ShouldRetrieveKitchenGuidelinesAndShutOffSteps()
    {
        // Arrange: User test case - "water leak in kitchen"
        var request = new IncidentPlanningRequest
        {
            IncidentId = 1,
            Description = "Severe water leak in kitchen under the sink causing water pooling on floor",
            Severity = IncidentSeverity.High,
            Budget = 35000,
            Deadline = DateTime.UtcNow.AddDays(2)
        };

        // Act
        var plan = await _agent.PlanIncidentAsync(request);

        // Assert: 1. RAG document retrieved
        Assert.NotNull(plan.RagKnowledge);
        Assert.Contains(plan.RagKnowledge.RetrievedDocuments, doc => doc.Id == "DOC-PLUMB-01");

        // Assert: 2. Water shut-off steps retrieved in immediate safety actions
        Assert.NotEmpty(plan.RagKnowledge.ImmediateSafetyActions);
        Assert.Contains(plan.RagKnowledge.ImmediateSafetyActions, action =>
            action.Contains("shut off the primary intake", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("isolation valve", StringComparison.OrdinalIgnoreCase));

        // Assert: 3. Execution plan contains multi-step cross-member plan
        Assert.Equal(6, plan.ExecutionPlan.Count);
        Assert.Contains(plan.ExecutionPlan, step => step.Action.Contains("Find Providers", StringComparison.OrdinalIgnoreCase));
        Assert.Contains(plan.ExecutionPlan, step => step.Action.Contains("Human Owner Approval", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task PlanIncidentAsync_ElectricalSocketIssue_ShouldRetrieveElectricalSafetyRules()
    {
        // Arrange: User test case - "electrical socket issue"
        var request = new IncidentPlanningRequest
        {
            IncidentId = 1,
            Description = "Sparks and burning smell coming from electrical socket issue in bedroom wall outlet",
            Severity = IncidentSeverity.High,
            Budget = 25000,
            Deadline = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var plan = await _agent.PlanIncidentAsync(request);

        // Assert: 1. RAG document retrieved
        Assert.NotNull(plan.RagKnowledge);
        Assert.Contains(plan.RagKnowledge.RetrievedDocuments, doc => doc.Id == "DOC-ELEC-06");

        // Assert: 2. Electrical safety rules retrieved
        Assert.NotEmpty(plan.RagKnowledge.ImmediateSafetyActions);
        Assert.Contains(plan.RagKnowledge.ImmediateSafetyActions, action =>
            action.Contains("breaker", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("isolate", StringComparison.OrdinalIgnoreCase));

        // Assert: 3. Specialization recommended
        Assert.Contains("Electrician", plan.RequiredSpecialization);
    }

    [Fact]
    public async Task PlanIncidentAsync_ElectricalShort_ShouldRetrieveElectricalRAG_AndRecommendElectrician()
    {
        // Arrange
        var request = new IncidentPlanningRequest
        {
            IncidentId = 2,
            Description = "Diesel generator starter motor burnout and automatic transfer switch circuit breaker trip",
            Severity = IncidentSeverity.Critical,
            Budget = 120000,
            Deadline = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var plan = await _agent.PlanIncidentAsync(request);

        // Assert
        Assert.NotNull(plan);
        Assert.Equal("CRITICAL", plan.Priority);
        Assert.Contains("Certified Heavy Electrical & Generator Technician", plan.RequiredSpecialization);
        Assert.Contains("Critical", plan.RiskAnalysis.RiskLevel);
        Assert.True(plan.RiskAnalysis.ContinuityThreat);

        // Verify Electrical RAG document
        Assert.Contains(plan.RagKnowledge.RetrievedDocuments, doc => doc.Id == "DOC-ELEC-02");
        Assert.Contains(plan.RagKnowledge.ImmediateSafetyActions, action => action.Contains("ATS"));
    }

    [Fact]
    public async Task PlanIncidentAsync_ShouldPersistExecutionLog_ForEvaluationTraceability()
    {
        // Arrange
        var request = new IncidentPlanningRequest
        {
            IncidentId = 1,
            Description = "Water leak in kitchen requiring emergency inspection and valve repair",
            Severity = IncidentSeverity.High,
            Budget = 30000,
            Deadline = DateTime.UtcNow.AddDays(2)
        };

        // Act
        var plan = await _agent.PlanIncidentAsync(request);

        // Assert: 1. Execution log persisted in DB
        var logs = await _agent.GetExecutionLogsAsync(request.IncidentId);
        Assert.NotEmpty(logs);

        var latestLog = logs.First();
        Assert.StartsWith("RUN-", latestLog.RunId);
        Assert.Equal(1, latestLog.IncidentId);
        Assert.Equal("HIGH", latestLog.Priority);
        Assert.NotEmpty(latestLog.Objective);
        Assert.NotEmpty(latestLog.RetrievedRagDocs!);
        Assert.NotEmpty(latestLog.ExecutionPlan!);
        Assert.True(latestLog.ExecutionDurationMs >= 0);

        // Assert: 2. Single log retrieval by ID
        var singleLog = await _agent.GetExecutionLogByIdAsync(latestLog.Id);
        Assert.NotNull(singleLog);
        Assert.Equal(latestLog.RunId, singleLog.RunId);
    }
}
