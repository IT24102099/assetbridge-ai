using Microsoft.EntityFrameworkCore;
using AssetBridge.Api.Data;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Services;

public class IncidentService : IIncidentService
{
    private readonly AppDbContext _context;

    public IncidentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<IncidentDto>> GetAllAsync(
        int? assetId = null,
        IncidentStatus? status = null,
        IncidentSeverity? severity = null,
        string? search = null)
    {
        var query = _context.Incidents
            .AsNoTracking()
            .Include(i => i.Asset)
            .Include(i => i.Evidences)
            .AsQueryable();

        if (assetId.HasValue)
        {
            query = query.Where(i => i.AssetId == assetId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(i => i.Status == status.Value);
        }

        if (severity.HasValue)
        {
            query = query.Where(i => i.Severity == severity.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(i =>
                i.Title.ToLower().Contains(searchLower) ||
                i.Description.ToLower().Contains(searchLower) ||
                (i.Asset != null && i.Asset.Name.ToLower().Contains(searchLower)) ||
                (i.Asset != null && i.Asset.AssetCode.ToLower().Contains(searchLower)));
        }

        var incidents = await query
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return incidents.Select(MapToDto);
    }

    public async Task<IncidentDto?> GetByIdAsync(int id)
    {
        var incident = await _context.Incidents
            .AsNoTracking()
            .Include(i => i.Asset)
            .Include(i => i.Evidences)
            .FirstOrDefaultAsync(i => i.Id == id);

        return incident == null ? null : MapToDto(incident);
    }

    public async Task<IncidentDto> CreateAsync(CreateIncidentDto dto)
    {
        // 1. Validation: Verify that linked Asset exists
        var asset = await _context.Assets.FindAsync(dto.AssetId);
        if (asset == null)
        {
            throw new KeyNotFoundException($"Asset with ID {dto.AssetId} was not found.");
        }

        // 2. Incident Creation with explicit initial status 'Reported'
        var incident = new Incident
        {
            AssetId = dto.AssetId,
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Severity = dto.Severity,
            Status = IncidentStatus.Reported,
            Budget = dto.Budget,
            PreferredDate = dto.PreferredDate,
            PhotoUrl = dto.PhotoUrl?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Incidents.Add(incident);

        // If photoUrl provided, create initial evidence entry
        if (!string.IsNullOrWhiteSpace(dto.PhotoUrl))
        {
            incident.Evidences.Add(new IncidentEvidence
            {
                FileUrl = dto.PhotoUrl.Trim(),
                FileType = "image/jpeg",
                UploadedAt = DateTime.UtcNow
            });
        }

        // 3. Track in Asset History
        var history = new AssetHistory
        {
            AssetId = asset.Id,
            EventType = "IncidentReported",
            Description = $"Incident '{incident.Title}' reported [Severity: {incident.Severity}]. Initial status: Reported.",
            Date = DateTime.UtcNow,
            RecordedBy = dto.ReportedBy?.Trim() ?? "System"
        };
        _context.AssetHistories.Add(history);

        // Automatically mark asset as Under Maintenance for High/Critical incidents
        if ((incident.Severity == IncidentSeverity.High || incident.Severity == IncidentSeverity.Critical) &&
            asset.Status == AssetStatus.Active)
        {
            asset.Status = AssetStatus.Maintenance;
            asset.UpdatedAt = DateTime.UtcNow;

            _context.AssetHistories.Add(new AssetHistory
            {
                AssetId = asset.Id,
                EventType = "StatusChanged",
                Description = $"Asset automatically transitioned to Maintenance due to {incident.Severity} incident '{incident.Title}'.",
                Date = DateTime.UtcNow,
                RecordedBy = "System"
            });
        }

        await _context.SaveChangesAsync();

        incident.Asset = asset;
        return MapToDto(incident);
    }

    public async Task<IncidentDto?> UpdateAsync(int id, UpdateIncidentDto dto)
    {
        var incident = await _context.Incidents
            .Include(i => i.Asset)
            .Include(i => i.Evidences)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (incident == null) return null;

        incident.Title = dto.Title.Trim();
        incident.Description = dto.Description.Trim();
        incident.Severity = dto.Severity;
        incident.Budget = dto.Budget;
        incident.PreferredDate = dto.PreferredDate;
        incident.PhotoUrl = dto.PhotoUrl?.Trim();
        incident.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(incident);
    }

    public async Task<IncidentDto?> UpdateStatusAsync(int id, UpdateIncidentStatusDto dto)
    {
        var incident = await _context.Incidents
            .Include(i => i.Asset)
            .Include(i => i.Evidences)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (incident == null) return null;

        var oldStatus = incident.Status;
        incident.Status = dto.Status;
        incident.UpdatedAt = DateTime.UtcNow;

        // Log status change in Asset History
        var historyNotes = string.IsNullOrWhiteSpace(dto.Notes) ? "" : $" Notes: {dto.Notes.Trim()}";
        _context.AssetHistories.Add(new AssetHistory
        {
            AssetId = incident.AssetId,
            EventType = "IncidentStatusUpdated",
            Description = $"Incident #{incident.Id} '{incident.Title}' status updated: {oldStatus} -> {dto.Status}.{historyNotes}",
            Date = DateTime.UtcNow,
            RecordedBy = dto.UpdatedBy?.Trim() ?? "System"
        });

        // If incident is resolved or closed, check if asset can revert to Active
        if (dto.Status == IncidentStatus.Resolved || dto.Status == IncidentStatus.Closed)
        {
            var otherActiveIncidents = await _context.Incidents.AnyAsync(i =>
                i.AssetId == incident.AssetId &&
                i.Id != incident.Id &&
                i.Status != IncidentStatus.Resolved &&
                i.Status != IncidentStatus.Closed);

            if (!otherActiveIncidents && incident.Asset != null && incident.Asset.Status == AssetStatus.Maintenance)
            {
                incident.Asset.Status = AssetStatus.Active;
                incident.Asset.UpdatedAt = DateTime.UtcNow;

                _context.AssetHistories.Add(new AssetHistory
                {
                    AssetId = incident.AssetId,
                    EventType = "StatusChanged",
                    Description = $"Asset restored to Active status after incident #{incident.Id} was {dto.Status}.",
                    Date = DateTime.UtcNow,
                    RecordedBy = "System"
                });
            }
        }

        await _context.SaveChangesAsync();

        return MapToDto(incident);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var incident = await _context.Incidents.FindAsync(id);
        if (incident == null) return false;

        _context.Incidents.Remove(incident);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IncidentEvidenceDto?> AddEvidenceAsync(int incidentId, AddIncidentEvidenceDto dto)
    {
        var incidentExists = await _context.Incidents.AnyAsync(i => i.Id == incidentId);
        if (!incidentExists) return null;

        var evidence = new IncidentEvidence
        {
            IncidentId = incidentId,
            FileUrl = dto.FileUrl.Trim(),
            FileType = dto.FileType.Trim(),
            UploadedAt = DateTime.UtcNow
        };

        _context.IncidentEvidences.Add(evidence);
        await _context.SaveChangesAsync();

        return new IncidentEvidenceDto
        {
            Id = evidence.Id,
            IncidentId = evidence.IncidentId,
            FileUrl = evidence.FileUrl,
            FileType = evidence.FileType,
            UploadedAt = evidence.UploadedAt
        };
    }

    private static IncidentDto MapToDto(Incident incident)
    {
        return new IncidentDto
        {
            Id = incident.Id,
            AssetId = incident.AssetId,
            AssetCode = incident.Asset?.AssetCode,
            AssetName = incident.Asset?.Name,
            AssetLocation = incident.Asset?.Location,
            Title = incident.Title,
            Description = incident.Description,
            Severity = incident.Severity,
            Status = incident.Status,
            Budget = incident.Budget,
            PreferredDate = incident.PreferredDate,
            PhotoUrl = incident.PhotoUrl,
            CreatedAt = incident.CreatedAt,
            UpdatedAt = incident.UpdatedAt,
            Evidences = incident.Evidences.Select(e => new IncidentEvidenceDto
            {
                Id = e.Id,
                IncidentId = e.IncidentId,
                FileUrl = e.FileUrl,
                FileType = e.FileType,
                UploadedAt = e.UploadedAt
            }).ToList()
        };
    }
}
