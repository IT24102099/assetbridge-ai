using AssetBridge.Backend.Models;

namespace AssetBridge.Backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AssetBridgeDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Inspections.Any())
            {
                return; // DB already seeded
            }

            // 1. Seed Inspections
            var inspection1 = new Inspection
            {
                Id = "INS-1021",
                IncidentId = "INC-1021",
                AssetId = "AS-KDY-001",
                AssetName = "Kandy House",
                InspectorId = "REP-001",
                InspectorName = "Nimal Perera (Representative)",
                ProblemCategory = "Water Leakage",
                Finding = "Damaged concealed PPR cold water pipe behind lower kitchen cabinets. High moisture level detected in adjacent masonry wall.",
                RequiredWork = "Concealed pipe replacement, Wall masonry repair & water-resistant plastering, Hydrostatic pressure leak testing",
                Priority = "HIGH",
                DamageLevel = "Moderate",
                Recommendations = "Replace damaged 25mm pipe section with PN20 PPR line. Isolate electrical outlets on south wall before cutting plaster.",
                Status = "Completed",
                LocationGps = "7.2906° N, 80.6337° E",
                InspectedAt = DateTime.UtcNow.AddDays(-2),
                EstimatedDamageCost = 40000,
                Photos = new List<string>
                {
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80"
                }
            };

            var inspection2 = new Inspection
            {
                Id = "INS-1022",
                IncidentId = "INC-1022",
                AssetId = "AS-COL-002",
                AssetName = "Colombo Sea View Apartment",
                InspectorId = "REP-002",
                InspectorName = "Sunil Silva (Representative)",
                ProblemCategory = "Air Conditioning",
                Finding = "Primary master bedroom split AC unit blowing ambient air. Oil stains identified at flare nut connection indicating R32 refrigerant loss.",
                RequiredWork = "Flare connection re-making, Nitrogen pressure hold test, Deep chemical evaporator wash, Gas recharge",
                Priority = "MEDIUM",
                DamageLevel = "Minor",
                Recommendations = "Service unit promptly to prevent compressor overheating.",
                Status = "Under Review",
                LocationGps = "6.9271° N, 79.8612° E",
                InspectedAt = DateTime.UtcNow.AddDays(-1),
                EstimatedDamageCost = 15000,
                Photos = new List<string>
                {
                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                }
            };

            var inspection3 = new Inspection
            {
                Id = "INS-1023",
                IncidentId = "INC-1023",
                AssetId = "AS-NUR-003",
                AssetName = "Nuwara Eliya Hillside Villa",
                InspectorId = "REP-001",
                InspectorName = "Nimal Perera (Representative)",
                ProblemCategory = "Roof Leakage",
                Finding = "Cracked clay ridge tiles and displaced flashing allowing heavy rainfall penetration into attic ceiling timber.",
                RequiredWork = "Roof tile re-alignment, Mortar pointing, Valley gutter clearance, Timber anti-fungal treatment",
                Priority = "HIGH",
                DamageLevel = "Moderate",
                Recommendations = "Execute before monsoon storm cycle expands ceiling water damage.",
                Status = "Completed",
                LocationGps = "6.9497° N, 80.7891° E",
                InspectedAt = DateTime.UtcNow.AddDays(-3),
                EstimatedDamageCost = 25000,
                Photos = new List<string>
                {
                    "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=600&q=80"
                }
            };

            context.Inspections.AddRange(inspection1, inspection2, inspection3);

            // 2. Seed Quotations (matching Page 14-15 examples!)
            var quotationA = new Quotation
            {
                Id = "QT-2026-001",
                IncidentId = "INC-1021",
                InspectionId = "INS-1021",
                AssetId = "AS-KDY-001",
                AssetName = "Kandy House",
                ProviderId = "PRV-001",
                ProviderName = "ABC Plumbing & Engineering",
                ProviderRating = 4.8,
                PreviousJobsCompleted = 24,
                DistanceKm = 4.2,
                IsVerified = true,
                AmountLkr = 38000,
                ExecutionTimeDays = 2,
                AvailableStartDate = "Tomorrow Morning",
                WarrantyMonths = 12,
                WarrantyDescription = "12 months full leak-free warranty on pipework and plaster joints",
                Status = "AI Recommended",
                IsAiRecommended = true,
                RecommendationScore = 96,
                RecommendationSummary = "Best overall value: lowest compliant cost, highest customer rating (4.8), and longest warranty (12 months).",
                RecommendationReasons = new List<string>
                {
                    "Within owner budget: LKR 38,000 vs LKR 75,000 budget (49.3% budget savings / LKR 37,000 surplus)",
                    "Certified master plumbing expertise with verified compliance on concealed pipework",
                    "Rapid turnaround: 2 days completion with next-day mobilization",
                    "Outstanding reliability: 4.8/5 rating with 24 past verified jobs on AssetBridge",
                    "Comprehensive 12-month full coverage warranty exceeds the 6-month minimum threshold"
                },
                SubmittedAt = DateTime.UtcNow.AddDays(-1),
                LineItems = new List<QuotationLineItem>
                {
                    new() { ItemName = "PPR 25mm PN20 Pipe & High-Pressure Fittings", Category = "Materials", Quantity = 2, UnitPrice = 4000, TotalPrice = 8000 },
                    new() { ItemName = "Certified Master Plumber Labor (2 Days)", Category = "Labour", Quantity = 1, UnitPrice = 15000, TotalPrice = 15000 },
                    new() { ItemName = "Masonry Wall Chasing & Water-Resistant Plaster Repair", Category = "Repair", Quantity = 1, UnitPrice = 12000, TotalPrice = 12000 },
                    new() { ItemName = "Hydrostatic Pressure Leak & Integrity Testing (6 bar)", Category = "Testing", Quantity = 1, UnitPrice = 3000, TotalPrice = 3000 }
                }
            };

            var quotationB = new Quotation
            {
                Id = "QT-2026-002",
                IncidentId = "INC-1021",
                InspectionId = "INS-1021",
                AssetId = "AS-KDY-001",
                AssetName = "Kandy House",
                ProviderId = "PRV-002",
                ProviderName = "QuickFix Plumbing Solutions",
                ProviderRating = 4.5,
                PreviousJobsCompleted = 18,
                DistanceKm = 8.5,
                IsVerified = true,
                AmountLkr = 42000,
                ExecutionTimeDays = 3,
                AvailableStartDate = "In 2 days",
                WarrantyMonths = 6,
                WarrantyDescription = "6 months standard repair warranty",
                Status = "Submitted",
                IsAiRecommended = false,
                RecommendationScore = 84,
                RecommendationSummary = "Strong candidate but higher cost (LKR 42,000) and shorter warranty (6 months).",
                RecommendationReasons = new List<string>
                {
                    "Within budget (LKR 42,000 vs LKR 75,000)",
                    "Good track record (4.5 rating, 18 jobs)",
                    "Higher cost than Provider A by LKR 4,000",
                    "Standard 6-month warranty"
                },
                SubmittedAt = DateTime.UtcNow.AddDays(-1),
                LineItems = new List<QuotationLineItem>
                {
                    new() { ItemName = "Pipe & Coupling Hardware", Category = "Materials", Quantity = 1, UnitPrice = 10000, TotalPrice = 10000 },
                    new() { ItemName = "Plumbing Labor", Category = "Labour", Quantity = 1, UnitPrice = 18000, TotalPrice = 18000 },
                    new() { ItemName = "Plaster Touchup & Sealing", Category = "Repair", Quantity = 1, UnitPrice = 10000, TotalPrice = 10000 },
                    new() { ItemName = "Testing & Commissioning", Category = "Testing", Quantity = 1, UnitPrice = 4000, TotalPrice = 4000 }
                }
            };

            var quotationC = new Quotation
            {
                Id = "QT-2026-003",
                IncidentId = "INC-1021",
                InspectionId = "INS-1021",
                AssetId = "AS-KDY-001",
                AssetName = "Kandy House",
                ProviderId = "PRV-003",
                ProviderName = "Home Services Lanka Ltd",
                ProviderRating = 4.1,
                PreviousJobsCompleted = 9,
                DistanceKm = 14.0,
                IsVerified = true,
                AmountLkr = 55000,
                ExecutionTimeDays = 4,
                AvailableStartDate = "Next Monday",
                WarrantyMonths = 3,
                WarrantyDescription = "3 months limited warranty",
                Status = "Submitted",
                IsAiRecommended = false,
                RecommendationScore = 68,
                RecommendationSummary = "Highest cost (LKR 55,000) with shortest warranty (3 months) and furthest distance.",
                RecommendationReasons = new List<string>
                {
                    "Within upper limit of owner budget but 44% more expensive than ABC Plumbing",
                    "Shortest warranty period (3 months limited)",
                    "Longer mobilization timeline"
                },
                SubmittedAt = DateTime.UtcNow.AddHours(-18),
                LineItems = new List<QuotationLineItem>
                {
                    new() { ItemName = "Premium Pipe Materials", Category = "Materials", Quantity = 1, UnitPrice = 12000, TotalPrice = 12000 },
                    new() { ItemName = "Specialist Team Labor", Category = "Labour", Quantity = 1, UnitPrice = 22000, TotalPrice = 22000 },
                    new() { ItemName = "Drywall Restoration & Waterproofing", Category = "Repair", Quantity = 1, UnitPrice = 15000, TotalPrice = 15000 },
                    new() { ItemName = "High-pressure Testing & Certification", Category = "Testing", Quantity = 1, UnitPrice = 6000, TotalPrice = 6000 }
                }
            };

            context.Quotations.AddRange(quotationA, quotationB, quotationC);

            // 3. Seed Maintenance Jobs
            var job1 = new MaintenanceJob
            {
                Id = "JOB-101",
                IncidentId = "INC-1021",
                InspectionId = "INS-1021",
                QuotationId = "QT-2026-001",
                AssetId = "AS-KDY-001",
                AssetName = "Kandy House",
                AssetAddress = "123, Peradeniya Road, Kandy",
                MaintenanceType = "Plumbing Repair",
                Title = "Kitchen Pipe Leak Repair & Wall Plastering",
                Description = "Excavate leaking concealed pipe section, weld new PPR pipe union, apply waterproof polymer plaster, and pressure test.",
                ProviderId = "PRV-001",
                ProviderName = "ABC Plumbing & Engineering",
                ProviderPhone = "+94 77 123 4567",
                ApprovedCostLkr = 38000,
                ScheduledDate = DateTime.UtcNow.Date.AddDays(1).AddHours(10),
                Status = "Work In Progress",
                ProgressPercentage = 60,
                PressureTestReading = "Tested at 6.0 bar static pressure - zero drop in 30 mins",
                WarrantyCertificateId = "WAR-KDY-8841",
                IsSignedOffByRep = false,
                BeforePhotos = new List<string>
                {
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                },
                CompletionPhotos = new List<string>(),
                CompletionNotes = "New PN20 pipe installed. First plaster coat drying under dehumidifier.",
                ProgressSteps = new List<JobProgressStep>
                {
                    new() { StepName = "Job Assigned", Description = "Quotation approved by Owner and job assigned to ABC Plumbing", Timestamp = DateTime.UtcNow.AddDays(-2), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Provider Accepted", Description = "ABC Plumbing confirmed job schedule & allocated certified plumber", Timestamp = DateTime.UtcNow.AddDays(-1).AddHours(-4), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "On the Way", Description = "Technician dispatched to Kandy House with PPR welding kit", Timestamp = DateTime.UtcNow.AddHours(-5), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Work In Progress", Description = "Pipe excavation complete, replacement pipe fitted, plaster curing", Timestamp = DateTime.UtcNow.AddHours(-2), IsCompleted = false, IsCurrent = true },
                    new() { StepName = "Completed", Description = "Pressure test verification, final paint touchup, owner sign-off", Timestamp = null, IsCompleted = false, IsCurrent = false }
                }
            };

            var job2 = new MaintenanceJob
            {
                Id = "JOB-102",
                IncidentId = "INC-1018",
                InspectionId = "INS-1018",
                QuotationId = "QT-2026-004",
                AssetId = "AS-COL-002",
                AssetName = "Colombo Sea View Apartment",
                AssetAddress = "45, Galle Road, Colombo 03",
                MaintenanceType = "AC Servicing",
                Title = "Full Chemical Wash & Gas Recharge",
                Description = "Clean indoor blower and outdoor condenser coils, vacuum recharge R32 refrigerant, clean condensate trap.",
                ProviderId = "PRV-004",
                ProviderName = "CoolAir Pro Solutions",
                ProviderPhone = "+94 71 888 9911",
                ApprovedCostLkr = 14500,
                ScheduledDate = DateTime.UtcNow.AddDays(-5),
                CompletedDate = DateTime.UtcNow.AddDays(-5).AddHours(3),
                Status = "Completed",
                ProgressPercentage = 100,
                PressureTestReading = "Refrigerant pressure steady at 120 PSI suction",
                WarrantyCertificateId = "WAR-COL-3312",
                IsSignedOffByRep = true,
                CompletionNotes = "All coils flushed chemically. Temperature differential between inlet and outlet measured at 12°C. Running optimally.",
                BeforePhotos = new List<string> { "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" },
                CompletionPhotos = new List<string> { "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
                ProgressSteps = new List<JobProgressStep>
                {
                    new() { StepName = "Job Assigned", Description = "Job assigned", Timestamp = DateTime.UtcNow.AddDays(-6), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Provider Accepted", Description = "Accepted", Timestamp = DateTime.UtcNow.AddDays(-6), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "On the Way", Description = "Dispatched", Timestamp = DateTime.UtcNow.AddDays(-5), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Work In Progress", Description = "Work performed", Timestamp = DateTime.UtcNow.AddDays(-5), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Completed", Description = "Completed & verified", Timestamp = DateTime.UtcNow.AddDays(-5), IsCompleted = true, IsCurrent = true }
                }
            };

            var job3 = new MaintenanceJob
            {
                Id = "JOB-103",
                IncidentId = "INC-1023",
                InspectionId = "INS-1023",
                QuotationId = "QT-2026-005",
                AssetId = "AS-NUR-003",
                AssetName = "Nuwara Eliya Hillside Villa",
                AssetAddress = "12, Single Tree Road, Nuwara Eliya",
                MaintenanceType = "Roof Waterproofing",
                Title = "Roof Valley Gutter Sealing & Ridge Tile Pointing",
                Description = "Clear valley gutter debris, point ridge tiles with waterproof polymer mortar, seal flashing seams.",
                ProviderId = "PRV-005",
                ProviderName = "Highland Roofing Specialists",
                ProviderPhone = "+94 52 222 3456",
                ApprovedCostLkr = 22000,
                ScheduledDate = DateTime.UtcNow.AddDays(2),
                Status = "Provider Accepted",
                ProgressPercentage = 25,
                WarrantyCertificateId = "WAR-NUR-9021",
                IsSignedOffByRep = false,
                ProgressSteps = new List<JobProgressStep>
                {
                    new() { StepName = "Job Assigned", Description = "Assigned", Timestamp = DateTime.UtcNow.AddDays(-1), IsCompleted = true, IsCurrent = false },
                    new() { StepName = "Provider Accepted", Description = "Accepted by Highland Roofing", Timestamp = DateTime.UtcNow.AddHours(-12), IsCompleted = true, IsCurrent = true },
                    new() { StepName = "On the Way", Description = "Scheduled for dispatch", Timestamp = null, IsCompleted = false, IsCurrent = false },
                    new() { StepName = "Work In Progress", Description = "Awaiting arrival", Timestamp = null, IsCompleted = false, IsCurrent = false },
                    new() { StepName = "Completed", Description = "Pending", Timestamp = null, IsCompleted = false, IsCurrent = false }
                }
            };

            context.MaintenanceJobs.AddRange(job1, job2, job3);

            // 4. Seed Maintenance History
            context.MaintenanceHistories.AddRange(
                new MaintenanceHistory
                {
                    Id = "MH-2026-001",
                    AssetId = "AS-KDY-001",
                    AssetName = "Kandy House",
                    JobId = "JOB-091",
                    MaintenanceType = "Water Pump Overhaul",
                    Description = "Replaced mechanical seals and impellers on Davey booster pump.",
                    CostLkr = 28000,
                    ProviderName = "ABC Plumbing & Engineering",
                    CompletedDate = DateTime.UtcNow.AddMonths(-3),
                    WarrantyUntil = DateTime.UtcNow.AddMonths(9),
                    Status = "Resolved"
                },
                new MaintenanceHistory
                {
                    Id = "MH-2026-002",
                    AssetId = "AS-KDY-001",
                    AssetName = "Kandy House",
                    JobId = "JOB-078",
                    MaintenanceType = "Electrical Switchboard Inspection",
                    Description = "Thermal imaging scan, tightened terminal lugs, replaced 32A RCBO breaker.",
                    CostLkr = 16500,
                    ProviderName = "ElectroSafe Kandy",
                    CompletedDate = DateTime.UtcNow.AddMonths(-6),
                    WarrantyUntil = DateTime.UtcNow.AddMonths(6),
                    Status = "Resolved"
                },
                new MaintenanceHistory
                {
                    Id = "MH-2026-003",
                    AssetId = "AS-COL-002",
                    AssetName = "Colombo Sea View Apartment",
                    JobId = "JOB-085",
                    MaintenanceType = "Balcony Waterproofing",
                    Description = "Polymer waterproofing screed applied to sliding door threshold.",
                    CostLkr = 34000,
                    ProviderName = "AquaShield Lanka",
                    CompletedDate = DateTime.UtcNow.AddMonths(-4),
                    WarrantyUntil = DateTime.UtcNow.AddMonths(20),
                    Status = "Resolved"
                },
                new MaintenanceHistory
                {
                    Id = "MH-2026-004",
                    AssetId = "AS-NUR-003",
                    AssetName = "Nuwara Eliya Hillside Villa",
                    JobId = "JOB-062",
                    MaintenanceType = "Chimney & Flue Desooting",
                    Description = "Cleared wood-burning fireplace flue, inspected firebrick mortar.",
                    CostLkr = 12000,
                    ProviderName = "Highland Services",
                    CompletedDate = DateTime.UtcNow.AddMonths(-8),
                    WarrantyUntil = DateTime.UtcNow.AddMonths(4),
                    Status = "Resolved"
                }
            );

            // 5. Seed Catalog Items (matching wireframe Page 18: Material/Service Catalog)
            context.CatalogItems.AddRange(
                new CatalogItem { Id = "CAT-001", ItemName = "PPR Pipe 25mm PN20 (4m)", Category = "Plumbing", Unit = "Piece", UnitPriceLkr = 2800, Status = "Available", Description = "Heavy-duty hot/cold pressure pipe" },
                new CatalogItem { Id = "CAT-002", ItemName = "Brass Ball Valve 1\" Full Bore", Category = "Plumbing", Unit = "Piece", UnitPriceLkr = 3200, Status = "Available", Description = "Lead-free high pressure isolation valve" },
                new CatalogItem { Id = "CAT-003", ItemName = "Waterproof Polymer Plaster (25kg)", Category = "Masonry", Unit = "Bag", UnitPriceLkr = 3500, Status = "Available", Description = "Hydrophobic repair mortar for leak patching" },
                new CatalogItem { Id = "CAT-004", ItemName = "Certified Master Plumber Day Rate", Category = "Plumbing", Unit = "Day", UnitPriceLkr = 15000, Status = "Available", Description = "Standard skilled 8-hour shift" },
                new CatalogItem { Id = "CAT-005", ItemName = "Wall Chasing & Plaster Restoration", Category = "Masonry", Unit = "Day", UnitPriceLkr = 12000, Status = "Available", Description = "Concealed pipe enclosure & finish plaster" },
                new CatalogItem { Id = "CAT-006", ItemName = "Hydrostatic Leak & Pressure Test", Category = "Testing", Unit = "Service", UnitPriceLkr = 3000, Status = "Available", Description = "Calibrated gauge testing up to 8 bar" },
                new CatalogItem { Id = "CAT-007", ItemName = "Certified Electrician Day Rate", Category = "Electrical", Unit = "Day", UnitPriceLkr = 16000, Status = "Available", Description = "IET / BS 7671 licensed technician" },
                new CatalogItem { Id = "CAT-008", ItemName = "RCBO Residual Current Breaker 32A", Category = "Electrical", Unit = "Piece", UnitPriceLkr = 5500, Status = "Available", Description = "Type A 30mA electrical trip device" },
                new CatalogItem { Id = "CAT-009", ItemName = "Split AC Full Chemical Flush", Category = "HVAC", Unit = "Service", UnitPriceLkr = 10500, Status = "Available", Description = "Coil cleaning & drainage purge" },
                new CatalogItem { Id = "CAT-010", ItemName = "R32 Refrigerant Gas (per kg)", Category = "HVAC", Unit = "Kg", UnitPriceLkr = 4500, Status = "Available", Description = "High-efficiency eco refrigerant" }
            );

            context.SaveChanges();
        }
    }
}
