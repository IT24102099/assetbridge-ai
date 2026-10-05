using Microsoft.EntityFrameworkCore;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        try
        {
            // Apply pending migrations if relational (PostgreSQL), or ensure created if in-memory
            if (context.Database.IsRelational())
            {
                await context.Database.MigrateAsync();
            }
            else
            {
                await context.Database.EnsureCreatedAsync();
            }

            if (await context.Assets.AnyAsync())
            {
                return; // Already seeded
            }

            var asset1 = new Asset
            {
                AssetCode = "AST-CMB-001",
                Name = "Colombo Central Water Pump #4",
                Category = "Water & Sanitation",
                Location = "Maligawatta Pumping Station, Colombo 10",
                Address = "No. 45 Baseline Road, Colombo 10, Western Province",
                Coordinates = "6.9271° N, 79.8612° E",
                Status = AssetStatus.Active,
                OwnerId = "USR-LK-9021",
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            };

            var asset2 = new Asset
            {
                AssetCode = "AST-KND-002",
                Name = "Peradeniya Backup Diesel Generator 250kVA",
                Category = "Electrical & Power",
                Location = "Faculty Engineering Substation, Peradeniya",
                Address = "Galaha Road, Peradeniya, Kandy, Central Province",
                Coordinates = "7.2588° N, 80.5966° E",
                Status = AssetStatus.Maintenance,
                OwnerId = "USR-LK-8832",
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            };

            var asset3 = new Asset
            {
                AssetCode = "AST-GAL-003",
                Name = "Galle Fort Sea Sluice Gate Control System",
                Category = "Civil & Flood Defense",
                Location = "Rampart Canal Basin, Galle Fort",
                Address = "Hospital Street, Galle Fort, Southern Province",
                Coordinates = "6.0329° N, 80.2168° E",
                Status = AssetStatus.Active,
                OwnerId = "USR-LK-7741",
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            };

            var asset4 = new Asset
            {
                AssetCode = "AST-JAFF-004",
                Name = "Jaffna Solar PV Farm Array 50kW",
                Category = "Renewable Energy",
                Location = "Chavakachcheri Solar Facility",
                Address = "A9 Highway, Chavakachcheri, Northern Province",
                Coordinates = "9.6582° N, 80.1583° E",
                Status = AssetStatus.Active,
                OwnerId = "USR-LK-6655",
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            context.Assets.AddRange(asset1, asset2, asset3, asset4);
            await context.SaveChangesAsync();

            // Seed Histories
            context.AssetHistories.AddRange(
                new AssetHistory
                {
                    AssetId = asset1.Id,
                    EventType = "Commissioned",
                    Description = "Asset commissioned and added to municipal monitoring network.",
                    Date = DateTime.UtcNow.AddMonths(-6),
                    RecordedBy = "Eng. P. Silva"
                },
                new AssetHistory
                {
                    AssetId = asset1.Id,
                    EventType = "Inspection",
                    Description = "Routine quarterly mechanical checkup. Gasket seal noted at 75% life.",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    RecordedBy = "Eng. P. Silva"
                },
                new AssetHistory
                {
                    AssetId = asset2.Id,
                    EventType = "Commissioned",
                    Description = "Generator installed, load-bank tested at 100% capacity.",
                    Date = DateTime.UtcNow.AddMonths(-4),
                    RecordedBy = "CEB Inspector Jayawardena"
                },
                new AssetHistory
                {
                    AssetId = asset2.Id,
                    EventType = "Maintenance Alert",
                    Description = "Status changed to Maintenance following ATS starter relay trip.",
                    Date = DateTime.UtcNow.AddDays(-3),
                    RecordedBy = "Tech. K. Bandara"
                }
            );

            // Seed Incidents
            var incident1 = new Incident
            {
                AssetId = asset1.Id,
                Title = "High Pressure Water Valve Defect",
                Description = "Severe residential water leakage detected in basement riser pipe flooding mechanical room.",
                Severity = IncidentSeverity.High,
                Status = IncidentStatus.Reported,
                Budget = 85000,
                PreferredDate = DateTime.UtcNow.AddDays(2),
                PhotoUrl = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
                CreatedAt = DateTime.UtcNow.AddHours(-14)
            };

            var incident2 = new Incident
            {
                AssetId = asset2.Id,
                Title = "Automatic Transfer Switch Sensor Alert",
                Description = "Generator starter circuit failure during scheduled grid cut test. Requires ATS panel inspection.",
                Severity = IncidentSeverity.Medium,
                Status = IncidentStatus.InProgress,
                Budget = 120000,
                PreferredDate = DateTime.UtcNow.AddDays(4),
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            };

            var incident3 = new Incident
            {
                AssetId = asset3.Id,
                Title = "Sluice Gate Winch Cable Corrosion",
                Description = "Tidal debris accumulation near hydraulic ram causing mechanical resistance.",
                Severity = IncidentSeverity.Critical,
                Status = IncidentStatus.UnderReview,
                Budget = 210000,
                PreferredDate = DateTime.UtcNow.AddDays(1),
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            };

            context.Incidents.AddRange(incident1, incident2, incident3);
            await context.SaveChangesAsync();

            // Seed Evidence
            context.IncidentEvidences.AddRange(
                new IncidentEvidence
                {
                    IncidentId = incident1.Id,
                    FileUrl = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
                    FileType = "image/jpeg",
                    UploadedAt = DateTime.UtcNow.AddHours(-13)
                },
                new IncidentEvidence
                {
                    IncidentId = incident3.Id,
                    FileUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
                    FileType = "image/jpeg",
                    UploadedAt = DateTime.UtcNow.AddDays(-1)
                }
            );

            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DbSeeder] Note: Database seeding skipped or encountered: {ex.Message}");
        }
    }
}
