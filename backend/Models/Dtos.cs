namespace AssetBridge.Backend.Models
{
    public class CreateInspectionDto
    {
        public string IncidentId { get; set; } = string.Empty;
        public string AssetId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string InspectorName { get; set; } = string.Empty;
        public string ProblemCategory { get; set; } = "Water Leakage";
        public string Finding { get; set; } = string.Empty;
        public string RequiredWork { get; set; } = string.Empty;
        public string Priority { get; set; } = "HIGH";
        public string DamageLevel { get; set; } = "Moderate";
        public string Recommendations { get; set; } = string.Empty;
        public string LocationGps { get; set; } = string.Empty;
        public List<string> Photos { get; set; } = new();
    }

    public class CreateQuotationDto
    {
        public string IncidentId { get; set; } = string.Empty;
        public string InspectionId { get; set; } = string.Empty;
        public string AssetId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public double ProviderRating { get; set; } = 4.5;
        public decimal AmountLkr { get; set; }
        public int ExecutionTimeDays { get; set; } = 2;
        public int WarrantyMonths { get; set; } = 12;
        public string AvailableStartDate { get; set; } = "This week";
        public List<QuotationLineItem> LineItems { get; set; } = new();
    }

    public class QuotationComparisonResultDto
    {
        public string IncidentId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public decimal OwnerBudgetLkr { get; set; }
        public List<Quotation> Quotations { get; set; } = new();
        public Quotation? RecommendedQuotation { get; set; }
        public AgentRecommendationDto? AiRecommendation { get; set; }
    }

    public class AgentRecommendationDto
    {
        public string RecommendedProvider { get; set; } = string.Empty;
        public string RecommendedQuotationId { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public decimal BudgetSavings { get; set; }
        public bool IsWithinBudget { get; set; } = true;
        public List<string> Reasons { get; set; } = new();
        public List<string> SafetyAndPolicyNotes { get; set; } = new();
        public string WorkBreakdownAnalysis { get; set; } = string.Empty;
        public string RagKnowledgeRetrieved { get; set; } = string.Empty;
    }

    public class UpdateJobProgressDto
    {
        public string Status { get; set; } = string.Empty; // Assigned, Provider Accepted, On the Way, Work In Progress, Completed
        public string Note { get; set; } = string.Empty;
    }

    public class CompleteJobDto
    {
        public List<string> CompletionPhotos { get; set; } = new();
        public string CompletionNotes { get; set; } = string.Empty;
        public string PressureTestReading { get; set; } = string.Empty;
    }
}
