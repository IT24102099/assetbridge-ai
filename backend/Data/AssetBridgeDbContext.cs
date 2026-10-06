using System.Text.Json;
using AssetBridge.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Data
{
    public class AssetBridgeDbContext : DbContext
    {
        public AssetBridgeDbContext(DbContextOptions<AssetBridgeDbContext> options) : base(options)
        {
        }

        public DbSet<Inspection> Inspections => Set<Inspection>();
        public DbSet<Quotation> Quotations => Set<Quotation>();
        public DbSet<MaintenanceJob> MaintenanceJobs => Set<MaintenanceJob>();
        public DbSet<MaintenanceHistory> MaintenanceHistories => Set<MaintenanceHistory>();
        public DbSet<CatalogItem> CatalogItems => Set<CatalogItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Inspection configuration
            modelBuilder.Entity<Inspection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Photos)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
            });

            // Quotation configuration
            modelBuilder.Entity<Quotation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RecommendationReasons)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                entity.Property(e => e.LineItems)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<QuotationLineItem>>(v, (JsonSerializerOptions?)null) ?? new List<QuotationLineItem>()
                    );
            });

            // MaintenanceJob configuration
            modelBuilder.Entity<MaintenanceJob>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProgressSteps)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<JobProgressStep>>(v, (JsonSerializerOptions?)null) ?? new List<JobProgressStep>()
                    );
                entity.Property(e => e.BeforePhotos)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                entity.Property(e => e.CompletionPhotos)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
            });

            // MaintenanceHistory configuration
            modelBuilder.Entity<MaintenanceHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // CatalogItem configuration
            modelBuilder.Entity<CatalogItem>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
        }
    }
}
