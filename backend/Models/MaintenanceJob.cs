using System.ComponentModel.DataAnnotations;

namespace AssetBridge.Backend.Models
{
    public class JobProgressStep
    {
        public string StepName { get; set; } = string.Empty; // Job Assigned, Provider Accepted, On the Way, Work In Progress, Completed
        public string Description { get; set; } = string.Empty;
        public DateTime? Timestamp { get; set; }
        public bool IsCompleted { get; set; } = false;
        public bool IsCurrent { get; set; } = false;
    }

    public class MaintenanceJob
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g. JOB-101
        public string IncidentId { get; set; } = string.Empty; // INC-1021
        public string InspectionId { get; set; } = string.Empty; // INS-1021
        public string QuotationId { get; set; } = string.Empty; // QT-2026-001

        public string AssetId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty; // Kandy House
        public string AssetAddress { get; set; } = "123, Peradeniya Road, Kandy";

        public string MaintenanceType { get; set; } = "Plumbing Repair"; // Plumbing, Electrical, HVAC, Roofing, Masonry
        public string Title { get; set; } = string.Empty; // Kitchen Pipe Leak Repair
        public string Description { get; set; } = string.Empty;

        public string ProviderId { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty; // ABC Plumbing
        public string ProviderPhone { get; set; } = "+94 77 123 4567";

        public decimal ApprovedCostLkr { get; set; } = 38000;
        public DateTime ScheduledDate { get; set; } = DateTime.UtcNow.AddDays(1);
        public DateTime? CompletedDate { get; set; }

        public string Status { get; set; } = "Work In Progress"; // Assigned, Provider Accepted, On the Way, Work In Progress, Completed
        public int ProgressPercentage { get; set; } = 60; // 0 - 100

        public List<JobProgressStep> ProgressSteps { get; set; } = new();

        // Completion & Verification
        public List<string> BeforePhotos { get; set; } = new();
        public List<string> CompletionPhotos { get; set; } = new();
        public string CompletionNotes { get; set; } = string.Empty;
        public string PressureTestReading { get; set; } = string.Empty; // e.g., "Tested at 6.0 bar static pressure - zero drop in 30 mins"
        public string WarrantyCertificateId { get; set; } = string.Empty;
        public bool IsSignedOffByRep { get; set; } = false;
    }
}
