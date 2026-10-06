using System.ComponentModel.DataAnnotations;

namespace AssetBridge.Backend.Models
{
    public class MaintenanceHistory
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g. MH-2025-089
        public string AssetId { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string JobId { get; set; } = string.Empty;
        public string MaintenanceType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal CostLkr { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public DateTime CompletedDate { get; set; }
        public DateTime? WarrantyUntil { get; set; }
        public string Status { get; set; } = "Resolved";
    }

    public class CatalogItem
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g. CAT-001
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Plumbing, Electrical, Masonry, HVAC, Roofing
        public string Unit { get; set; } = "Piece"; // Piece, Hour, Day, Bag, Meter, Can
        public decimal UnitPriceLkr { get; set; }
        public string Status { get; set; } = "Available"; // Available, Low Stock, Discontinued
        public string Description { get; set; } = string.Empty;
    }
}
