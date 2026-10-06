using System.ComponentModel.DataAnnotations;

namespace AssetBridge.Backend.Models
{
    public class Inspection
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g., INS-1021
        public string IncidentId { get; set; } = string.Empty; // e.g., INC-1021
        public string AssetId { get; set; } = string.Empty; // e.g., AS-KDY-001
        public string AssetName { get; set; } = string.Empty; // e.g., Kandy House
        public string InspectorId { get; set; } = string.Empty;
        public string InspectorName { get; set; } = string.Empty; // e.g., Nimal Perera (Representative)
        
        public string ProblemCategory { get; set; } = "Water Leakage";
        public string Finding { get; set; } = string.Empty; // e.g., Damaged concealed water pipe behind kitchen cabinet
        public string RequiredWork { get; set; } = string.Empty; // Pipe replacement, Wall plaster repair, Leak testing
        public string Priority { get; set; } = "HIGH"; // LOW, MEDIUM, HIGH, EMERGENCY
        public string DamageLevel { get; set; } = "Moderate"; // Minor, Moderate, Severe, Critical
        public string Recommendations { get; set; } = string.Empty;
        public string Status { get; set; } = "Completed"; // Scheduled, In Progress, Completed, Under Review
        
        public DateTime InspectedAt { get; set; } = DateTime.UtcNow;
        public string LocationGps { get; set; } = "7.2906° N, 80.6337° E";
        public List<string> Photos { get; set; } = new();
        public decimal EstimatedDamageCost { get; set; } = 40000;
        
        // Navigation / related
        public List<Quotation> Quotations { get; set; } = new();
    }
}
