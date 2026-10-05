using Microsoft.AspNetCore.Mvc;
using AssetBridge.Api.Agent.Models;
using AssetBridge.Api.Agent.Rag;
using AssetBridge.Api.Agent.Services;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Controllers;

[ApiController]
[Route("api/agent")]
[Produces("application/json")]
public class IncidentAgentController : ControllerBase
{
    private readonly IIncidentPlanningAgent _agent;
    private readonly IKnowledgeBaseService _knowledgeBase;
    private readonly ILogger<IncidentAgentController> _logger;

    public IncidentAgentController(
        IIncidentPlanningAgent agent,
        IKnowledgeBaseService knowledgeBase,
        ILogger<IncidentAgentController> logger)
    {
        _agent = agent;
        _knowledgeBase = knowledgeBase;
        _logger = logger;
    }

    /// <summary>
    /// Executes the Incident Planning Agent on an incident to retrieve asset metadata, RAG maintenance guides, and produce a multi-step execution plan.
    /// </summary>
    /// <param name="request">Incident parameters including IncidentId, Description, Severity, Budget, and Deadline.</param>
    /// <returns>Structured execution plan with objective, priority, tools invoked, and RAG knowledge context.</returns>
    [HttpPost("incident-planning")]
    [ProducesResponseType(typeof(IncidentPlanningResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IncidentPlanningResponse>> PlanIncident([FromBody] IncidentPlanningRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _logger.LogInformation("Invoking Incident Planning Agent for Incident ID {IncidentId}", request.IncidentId);
            var response = await _agent.PlanIncidentAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Incident Planning Agent encountered an error: {Message}", ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Shortcut endpoint to generate a plan for an existing incident by its ID.
    /// </summary>
    [HttpPost("incident-planning/{incidentId:int}")]
    [ProducesResponseType(typeof(IncidentPlanningResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IncidentPlanningResponse>> PlanExistingIncident(int incidentId)
    {
        var request = new IncidentPlanningRequest { IncidentId = incidentId };
        var response = await _agent.PlanIncidentAsync(request);
        return Ok(response);
    }

    /// <summary>
    /// Retrieves the registered tool definitions available to the agent (GetAsset, GetIncident, GetAssetHistory, GetIncidentEvidence, CreateWorkflowPlan).
    /// </summary>
    [HttpGet("capabilities")]
    [ProducesResponseType(typeof(List<AgentToolDefinition>), StatusCodes.Status200OK)]
    public ActionResult<List<AgentToolDefinition>> GetCapabilities()
    {
        var tools = _agent.GetCapabilities();
        return Ok(tools);
    }

    /// <summary>
    /// Searches or retrieves documents from the Maintenance Knowledge Base used by RAG retrieval.
    /// </summary>
    [HttpGet("knowledge-base")]
    [ProducesResponseType(typeof(List<KnowledgeDocument>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<KnowledgeDocument>>> GetKnowledgeDocuments([FromQuery] string? query = null)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            var all = await _knowledgeBase.GetAllDocumentsAsync();
            return Ok(all);
        }

        var results = await _knowledgeBase.RetrieveRelevantDocumentsAsync(query);
        return Ok(results);
    }

    /// <summary>
    /// Retrieves audit log records of historical agent execution runs for traceability and evaluation.
    /// </summary>
    [HttpGet("runs")]
    [ProducesResponseType(typeof(List<AgentExecutionRecord>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AgentExecutionRecord>>> GetExecutionRuns([FromQuery] int? incidentId = null)
    {
        var logs = await _agent.GetExecutionLogsAsync(incidentId);
        return Ok(logs);
    }

    /// <summary>
    /// Retrieves a specific agent execution audit log record by ID.
    /// </summary>
    [HttpGet("runs/{id:int}")]
    [ProducesResponseType(typeof(AgentExecutionRecord), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgentExecutionRecord>> GetExecutionRunById(int id)
    {
        var log = await _agent.GetExecutionLogByIdAsync(id);
        if (log == null)
        {
            return NotFound(new { error = $"Execution record {id} not found." });
        }
        return Ok(log);
    }
}

