using Microsoft.EntityFrameworkCore;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<IncidentEvidence> IncidentEvidences => Set<IncidentEvidence>();
    public DbSet<AssetHistory> AssetHistories => Set<AssetHistory>();
    public DbSet<AgentExecutionRecord> AgentExecutionRecords => Set<AgentExecutionRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Asset Configuration
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasIndex(a => a.AssetCode)
                  .IsUnique();

            entity.Property(a => a.Status)
                  .HasConversion<string>()
                  .HasMaxLength(30);

            entity.HasMany(a => a.Incidents)
                  .WithOne(i => i.Asset)
                  .HasForeignKey(i => i.AssetId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(a => a.Histories)
                  .WithOne(h => h.Asset)
                  .HasForeignKey(h => h.AssetId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Incident Configuration
        modelBuilder.Entity<Incident>(entity =>
        {
            entity.Property(i => i.Severity)
                  .HasConversion<string>()
                  .HasMaxLength(20);

            entity.Property(i => i.Status)
                  .HasConversion<string>()
                  .HasMaxLength(30);

            entity.Property(i => i.Budget)
                  .HasPrecision(18, 2);

            entity.HasMany(i => i.Evidences)
                  .WithOne(e => e.Incident)
                  .HasForeignKey(e => e.IncidentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // IncidentEvidence Configuration
        modelBuilder.Entity<IncidentEvidence>(entity =>
        {
            entity.Property(e => e.FileType)
                  .HasMaxLength(50);
        });

        // AssetHistory Configuration
        modelBuilder.Entity<AssetHistory>(entity =>
        {
            entity.Property(h => h.EventType)
                  .HasMaxLength(100);
        });
    }
}
