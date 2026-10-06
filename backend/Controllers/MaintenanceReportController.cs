using AssetBridge.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Controllers
{
    public class MaintenanceReportDto
    {
        public int TotalJobs { get; set; }
        public int CompletedJobs { get; set; }
        public int InProgressJobs { get; set; }
        public int PendingJobs { get; set; }
        public decimal TotalSpentLkr { get; set; }
        public decimal TotalBudgetSavedLkr { get; set; }
        public List<MonthlyCostTrendDto> CostTrends { get; set; } = new();
        public List<MaintenanceTypeDistributionDto> TypeDistributions { get; set; } = new();
    }

    public class MonthlyCostTrendDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal AmountLkr { get; set; }
        public int JobCount { get; set; }
    }

    public class MaintenanceTypeDistributionDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
        public decimal TotalCostLkr { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceReportController : ControllerBase
    {
        private readonly AssetBridgeDbContext _context;

        public MaintenanceReportController(AssetBridgeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<MaintenanceReportDto>> GetReports()
        {
            var jobs = await _context.MaintenanceJobs.ToListAsync();
            var history = await _context.MaintenanceHistories.ToListAsync();

            int completed = jobs.Count(j => j.Status == "Completed") + history.Count;
            int inProgress = jobs.Count(j => j.Status == "Work In Progress" || j.Status == "On the Way");
            int pending = jobs.Count(j => j.Status == "Assigned" || j.Status == "Provider Accepted");

            decimal totalSpent = jobs.Where(j => j.Status == "Completed").Sum(j => j.ApprovedCostLkr) 
                               + history.Sum(h => h.CostLkr);

            var report = new MaintenanceReportDto
            {
                TotalJobs = completed + inProgress + pending,
                CompletedJobs = completed,
                InProgressJobs = inProgress,
                PendingJobs = pending,
                TotalSpentLkr = totalSpent,
                TotalBudgetSavedLkr = 78500,
                CostTrends = new List<MonthlyCostTrendDto>
                {
                    new() { Month = "Apr 2026", AmountLkr = 45000, JobCount = 2 },
                    new() { Month = "May 2026", AmountLkr = 62000, JobCount = 4 },
                    new() { Month = "Jun 2026", AmountLkr = 38000, JobCount = 2 },
                    new() { Month = "Jul 2026", AmountLkr = 84000, JobCount = 5 },
                    new() { Month = "Aug 2026", AmountLkr = 52500, JobCount = 3 },
                    new() { Month = "Sep 2026", AmountLkr = 74500, JobCount = 4 }
                },
                TypeDistributions = new List<MaintenanceTypeDistributionDto>
                {
                    new() { Type = "Plumbing", Count = 9, Percentage = 45, TotalCostLkr = 168000 },
                    new() { Type = "Electrical", Count = 4, Percentage = 20, TotalCostLkr = 78000 },
                    new() { Type = "HVAC / AC", Count = 3, Percentage = 15, TotalCostLkr = 46500 },
                    new() { Type = "Roofing", Count = 2, Percentage = 10, TotalCostLkr = 39000 },
                    new() { Type = "Masonry", Count = 2, Percentage = 10, TotalCostLkr = 24500 }
                }
            };

            return Ok(report);
        }
    }
}
