using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using AssetBridge.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotationController : ControllerBase
    {
        private readonly AssetBridgeDbContext _context;
        private readonly IComparisonService _comparisonService;

        public QuotationController(AssetBridgeDbContext context, IComparisonService comparisonService)
        {
            _context = context;
            _comparisonService = comparisonService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quotation>>> GetQuotations([FromQuery] string? incidentId, [FromQuery] string? assetId)
        {
            var query = _context.Quotations.AsQueryable();

            if (!string.IsNullOrEmpty(incidentId))
            {
                query = query.Where(q => q.IncidentId == incidentId);
            }

            if (!string.IsNullOrEmpty(assetId))
            {
                query = query.Where(q => q.AssetId == assetId);
            }

            return Ok(await query.OrderBy(q => q.AmountLkr).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Quotation>> GetQuotationById(string id)
        {
            var quotation = await _context.Quotations.FindAsync(id);
            if (quotation == null)
            {
                return NotFound(new { message = $"Quotation with ID {id} not found." });
            }

            return Ok(quotation);
        }

        [HttpPost]
        public async Task<ActionResult<Quotation>> CreateQuotation([FromBody] CreateQuotationDto dto)
        {
            var id = $"QT-2026-{new Random().Next(100, 999)}";
            var quotation = new Quotation
            {
                Id = id,
                IncidentId = string.IsNullOrEmpty(dto.IncidentId) ? "INC-1021" : dto.IncidentId,
                InspectionId = string.IsNullOrEmpty(dto.InspectionId) ? "INS-1021" : dto.InspectionId,
                AssetId = string.IsNullOrEmpty(dto.AssetId) ? "AS-KDY-001" : dto.AssetId,
                AssetName = string.IsNullOrEmpty(dto.AssetName) ? "Kandy House" : dto.AssetName,
                ProviderId = $"PRV-{new Random().Next(10, 99)}",
                ProviderName = dto.ProviderName,
                ProviderRating = dto.ProviderRating > 0 ? dto.ProviderRating : 4.5,
                AmountLkr = dto.AmountLkr,
                ExecutionTimeDays = dto.ExecutionTimeDays > 0 ? dto.ExecutionTimeDays : 2,
                WarrantyMonths = dto.WarrantyMonths > 0 ? dto.WarrantyMonths : 12,
                AvailableStartDate = dto.AvailableStartDate,
                Status = "Submitted",
                SubmittedAt = DateTime.UtcNow,
                LineItems = dto.LineItems ?? new List<QuotationLineItem>()
            };

            _context.Quotations.Add(quotation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuotationById), new { id = quotation.Id }, quotation);
        }

        [HttpGet("compare/{incidentId}")]
        public async Task<ActionResult<QuotationComparisonResultDto>> CompareQuotations(string incidentId, [FromQuery] decimal budget = 75000)
        {
            var result = await _comparisonService.CompareQuotationsForIncidentAsync(incidentId, budget);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<Quotation>> UpdateStatus(string id, [FromBody] string status)
        {
            var quotation = await _context.Quotations.FindAsync(id);
            if (quotation == null)
            {
                return NotFound(new { message = $"Quotation with ID {id} not found." });
            }

            quotation.Status = status;
            await _context.SaveChangesAsync();

            return Ok(quotation);
        }
    }
}
