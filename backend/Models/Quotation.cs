using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AssetBridge.Backend.Models
{
    public class QuotationLineItem
    {
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Materials, Labour, Repair, Testing
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class Quotation
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g. QT-2026-001
        public string IncidentId { get; set; } = string.Empty; // e.g. INC-1021
        public string InspectionId { get; set; } = string.Empty; // e.g. INS-1021
        public string AssetId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;

        // Provider Details
        public string ProviderId { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty; // e.g. ABC Plumbing / QuickFix
        public double ProviderRating { get; set; } = 4.8;
        public int PreviousJobsCompleted { get; set; } = 24;
        public double DistanceKm { get; set; } = 4.2;
        public bool IsVerified { get; set; } = true;

        // Cost & Timing
        public decimal AmountLkr { get; set; } // e.g. 38000
        public int ExecutionTimeDays { get; set; } = 2;
        public string AvailableStartDate { get; set; } = "This week";
        public int WarrantyMonths { get; set; } = 12; // e.g. 12 months
        public string WarrantyDescription { get; set; } = "12 months full leak-free warranty on pipework and joints";

        // Status & AI Scoring
        public string Status { get; set; } = "Submitted"; // Submitted, Under Review, AI Recommended, Approved, Rejected
        public bool IsAiRecommended { get; set; } = false;
        public int RecommendationScore { get; set; } = 0; // 0 - 100
        public string RecommendationSummary { get; set; } = string.Empty;
        public List<string> RecommendationReasons { get; set; } = new();

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime ValidUntil { get; set; } = DateTime.UtcNow.AddDays(14);

        // Line Items breakdown
        public List<QuotationLineItem> LineItems { get; set; } = new();

        // Foreign Key / Navigation
        [JsonIgnore]
        public Inspection? Inspection { get; set; }
    }
}
