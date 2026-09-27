using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly AssetBridgeDbContext _context;

        public MaintenanceController(AssetBridgeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceJob>>> GetJobs([FromQuery] string? status, [FromQuery] string? assetId)
        {
            var query = _context.MaintenanceJobs.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(j => j.Status == status);
            }

            if (!string.IsNullOrEmpty(assetId))
            {
                query = query.Where(j => j.AssetId == assetId);
            }

            return Ok(await query.OrderByDescending(j => j.ScheduledDate).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceJob>> GetJobById(string id)
        {
            var job = await _context.MaintenanceJobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = $"Maintenance job {id} not found." });
            }

            return Ok(job);
        }

        [HttpPost("{id}/progress")]
        public async Task<ActionResult<MaintenanceJob>> UpdateJobProgress(string id, [FromBody] UpdateJobProgressDto dto)
        {
            var job = await _context.MaintenanceJobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = $"Maintenance job {id} not found." });
            }

            job.Status = dto.Status;
            
            // Update percentage and current step
            int percentage = dto.Status switch
            {
                "Assigned" => 20,
                "Provider Accepted" => 40,
                "On the Way" => 60,
                "Work In Progress" => 80,
                "Completed" => 100,
                _ => job.ProgressPercentage
            };
            job.ProgressPercentage = percentage;

            foreach (var step in job.ProgressSteps)
            {
                if (step.StepName.Equals(dto.Status, StringComparison.OrdinalIgnoreCase))
                {
                    step.IsCompleted = true;
                    step.IsCurrent = true;
                    step.Timestamp = DateTime.UtcNow;
                    if (!string.IsNullOrEmpty(dto.Note)) step.Description = dto.Note;
                }
                else
                {
                    step.IsCurrent = false;
                }
            }

            if (dto.Status == "Completed" && job.CompletedDate == null)
            {
                job.CompletedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(job);
        }

        [HttpPost("{id}/complete")]
        public async Task<ActionResult<MaintenanceJob>> CompleteJob(string id, [FromBody] CompleteJobDto dto)
        {
            var job = await _context.MaintenanceJobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = $"Maintenance job {id} not found." });
            }

            job.Status = "Completed";
            job.ProgressPercentage = 100;
            job.CompletedDate = DateTime.UtcNow;
            job.CompletionNotes = dto.CompletionNotes;
            job.PressureTestReading = dto.PressureTestReading;
            
            if (dto.CompletionPhotos != null && dto.CompletionPhotos.Any())
            {
                job.CompletionPhotos.AddRange(dto.CompletionPhotos);
            }

            foreach (var step in job.ProgressSteps)
            {
                step.IsCompleted = true;
                if (step.StepName == "Completed")
                {
                    step.IsCurrent = true;
                    step.Timestamp = DateTime.UtcNow;
                    step.Description = "Verification completed, completion photos approved";
                }
                else
                {
                    step.IsCurrent = false;
                }
            }

            // Create maintenance history entry for continuity
            var history = new MaintenanceHistory
            {
                Id = $"MH-{DateTime.UtcNow.Year}-{new Random().Next(100, 999)}",
                AssetId = job.AssetId,
                AssetName = job.AssetName,
                JobId = job.Id,
                MaintenanceType = job.MaintenanceType,
                Description = job.Title,
                CostLkr = job.ApprovedCostLkr,
                ProviderName = job.ProviderName,
                CompletedDate = DateTime.UtcNow,
                WarrantyUntil = DateTime.UtcNow.AddMonths(12),
                Status = "Resolved"
            };
            _context.MaintenanceHistories.Add(history);

            await _context.SaveChangesAsync();
            return Ok(job);
        }

        [HttpGet("history/{assetId}")]
        public async Task<ActionResult<IEnumerable<MaintenanceHistory>>> GetMaintenanceHistory(string assetId)
        {
            var history = await _context.MaintenanceHistories
                .Where(h => h.AssetId == assetId)
                .OrderByDescending(h => h.CompletedDate)
                .ToListAsync();

            return Ok(history);
        }
    }
}
