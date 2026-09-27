using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using AssetBridge.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InspectionController : ControllerBase
    {
        private readonly AssetBridgeDbContext _context;
        private readonly IAgent3RecommendationService _agent3Service;

        public InspectionController(AssetBridgeDbContext context, IAgent3RecommendationService agent3Service)
        {
            _context = context;
            _agent3Service = agent3Service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inspection>>> GetInspections([FromQuery] string? assetId, [FromQuery] string? status)
        {
            var query = _context.Inspections.AsQueryable();

            if (!string.IsNullOrEmpty(assetId))
            {
                query = query.Where(i => i.AssetId == assetId);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            return Ok(await query.OrderByDescending(i => i.InspectedAt).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Inspection>> GetInspectionById(string id)
        {
            var inspection = await _context.Inspections
                .Include(i => i.Quotations)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inspection == null)
            {
                return NotFound(new { message = $"Inspection with ID {id} not found." });
            }

            return Ok(inspection);
        }

        [HttpPost]
        public async Task<ActionResult<Inspection>> CreateInspection([FromBody] CreateInspectionDto dto)
        {
            var id = $"INS-{new Random().Next(1030, 9999)}";
            var inspection = new Inspection
            {
                Id = id,
                IncidentId = dto.IncidentId,
                AssetId = dto.AssetId,
                AssetName = string.IsNullOrEmpty(dto.AssetName) ? "Kandy House" : dto.AssetName,
                InspectorId = "REP-001",
                InspectorName = string.IsNullOrEmpty(dto.InspectorName) ? "Nimal Perera (Representative)" : dto.InspectorName,
                ProblemCategory = dto.ProblemCategory,
                Finding = dto.Finding,
                RequiredWork = dto.RequiredWork,
                Priority = dto.Priority,
                DamageLevel = dto.DamageLevel,
                Recommendations = dto.Recommendations,
                LocationGps = string.IsNullOrEmpty(dto.LocationGps) ? "7.2906° N, 80.6337° E" : dto.LocationGps,
                Status = "Completed",
                InspectedAt = DateTime.UtcNow,
                Photos = dto.Photos ?? new List<string>()
            };

            _context.Inspections.Add(inspection);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInspectionById), new { id = inspection.Id }, inspection);
        }

        [HttpGet("{id}/ai-suggestion")]
        public async Task<ActionResult<InspectionWorkSuggestionDto>> GetAiSuggestionForInspection(string id)
        {
            try
            {
                var suggestion = await _agent3Service.AnalyzeInspectionFindingsAsync(id);
                return Ok(suggestion);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Inspection with ID {id} not found." });
            }
        }
    }
}
