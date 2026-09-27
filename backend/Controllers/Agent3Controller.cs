using AssetBridge.Backend.Models;
using AssetBridge.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetBridge.Backend.Controllers
{
    public class RunAgent3Request
    {
        public string IncidentId { get; set; } = "INC-1021";
        public decimal BudgetLkr { get; set; } = 75000;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class Agent3Controller : ControllerBase
    {
        private readonly IAgent3RecommendationService _agent3Service;

        public Agent3Controller(IAgent3RecommendationService agent3Service)
        {
            _agent3Service = agent3Service;
        }

        [HttpPost("evaluate")]
        public async Task<ActionResult<AgentRecommendationDto>> Evaluate([FromBody] RunAgent3Request request)
        {
            var recommendation = await _agent3Service.RunAgent3RecommendationAsync(request.IncidentId, request.BudgetLkr);
            return Ok(recommendation);
        }

        [HttpGet("rag-search")]
        public async Task<ActionResult<List<RagSearchResultDto>>> SearchRag([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                query = "water leak plumbing safety";
            }

            var results = await _agent3Service.QueryRagKnowledgeBaseAsync(query);
            return Ok(results);
        }

        [HttpGet("tools")]
        public ActionResult<object> GetAvailableTools()
        {
            return Ok(new
            {
                agent = "Agent 3 — Maintenance & Cost Recommendation Agent",
                role = "Member 3 AI Contribution: Maintenance Planning & Quotation Management",
                tools = new[]
                {
                    new { name = "GetInspection", description = "Retrieves on-site inspection findings, damages, and photos by inspectionId." },
                    new { name = "GetMaintenanceHistory", description = "Retrieves asset maintenance ledger, past contractor performance, and active warranties." },
                    new { name = "GetQuotations", description = "Fetches all competitive contractor bids submitted for an incident." },
                    new { name = "CompareQuotations", description = "Executes multi-criteria evaluation (cost, time, warranty, provider rating, previous jobs)." },
                    new { name = "CheckBudget", description = "Validates proposal costs against owner allocation and flags cost overruns or savings." },
                    new { name = "CalculateTotalCost", description = "Audits line-item breakdowns (materials, labour, testing) against regional catalog norms." },
                    new { name = "GetWarrantyInformation", description = "Cross-references vendor warranty terms against minimum legal policy requirements." }
                }
            });
        }
    }
}
