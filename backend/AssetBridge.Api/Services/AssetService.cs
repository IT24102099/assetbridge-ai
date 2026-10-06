using Microsoft.EntityFrameworkCore;
using AssetBridge.Api.Data;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Services;

public class AssetService : IAssetService
{
    private readonly AppDbContext _context;

    public AssetService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AssetDto>> GetAllAsync(string? search = null, string? category = null, AssetStatus? status = null)
    {
        var query = _context.Assets.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(a =>
                a.Name.ToLower().Contains(searchLower) ||
                a.AssetCode.ToLower().Contains(searchLower) ||
                a.Location.ToLower().Contains(searchLower) ||
                a.Category.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(a => a.Category.ToLower() == category.Trim().ToLower());
        }

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        var assets = await query
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetCode = a.AssetCode,
                Name = a.Name,
                Category = a.Category,
                Location = a.Location,
                Address = a.Address,
                Coordinates = a.Coordinates,
                Status = a.Status,
                OwnerId = a.OwnerId,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                ActiveIncidentsCount = a.Incidents.Count(i =>
                    i.Status != IncidentStatus.Closed && i.Status != IncidentStatus.Resolved)
            })
            .ToListAsync();

        return assets;
    }

    public async Task<AssetDto?> GetByIdAsync(int id, bool includeHistory = false)
    {
        var query = _context.Assets.AsNoTracking().Where(a => a.Id == id);

        if (includeHistory)
        {
            query = query.Include(a => a.Histories.OrderByDescending(h => h.Date));
        }

        var asset = await query.FirstOrDefaultAsync();
        if (asset == null) return null;

        var activeIncidentsCount = await _context.Incidents
            .CountAsync(i => i.AssetId == id &&
                             i.Status != IncidentStatus.Closed &&
                             i.Status != IncidentStatus.Resolved);

        return MapToDto(asset, activeIncidentsCount, includeHistory);
    }

    public async Task<AssetDto?> GetByCodeAsync(string assetCode, bool includeHistory = false)
    {
        var query = _context.Assets.AsNoTracking().Where(a => a.AssetCode.ToLower() == assetCode.Trim().ToLower());

        if (includeHistory)
        {
            query = query.Include(a => a.Histories.OrderByDescending(h => h.Date));
        }

        var asset = await query.FirstOrDefaultAsync();
        if (asset == null) return null;

        var activeIncidentsCount = await _context.Incidents
            .CountAsync(i => i.AssetId == asset.Id &&
                             i.Status != IncidentStatus.Closed &&
                             i.Status != IncidentStatus.Resolved);

        return MapToDto(asset, activeIncidentsCount, includeHistory);
    }

    public async Task<AssetDto> CreateAsync(CreateAssetDto dto, string? recordedBy = null)
    {
        var normalizedCode = dto.AssetCode.Trim().ToUpper();
        var exists = await _context.Assets.AnyAsync(a => a.AssetCode.ToUpper() == normalizedCode);
        if (exists)
        {
            throw new InvalidOperationException($"Asset with code '{dto.AssetCode}' already exists.");
        }

        var asset = new Asset
        {
            AssetCode = normalizedCode,
            Name = dto.Name.Trim(),
            Category = dto.Category.Trim(),
            Location = dto.Location.Trim(),
            Address = dto.Address?.Trim(),
            Coordinates = dto.Coordinates?.Trim(),
            Status = dto.Status,
            OwnerId = dto.OwnerId?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Assets.Add(asset);

        // Track creation history
        var history = new AssetHistory
        {
            Asset = asset,
            EventType = "Registered",
            Description = $"Asset '{asset.Name}' registered in category '{asset.Category}' at '{asset.Location}'. Status: {asset.Status}.",
            Date = DateTime.UtcNow,
            RecordedBy = recordedBy ?? dto.OwnerId ?? "System"
        };
        _context.AssetHistories.Add(history);

        await _context.SaveChangesAsync();

        return MapToDto(asset, 0, false);
    }

    public async Task<AssetDto?> UpdateAsync(int id, UpdateAssetDto dto, string? recordedBy = null)
    {
        var asset = await _context.Assets.FindAsync(id);
        if (asset == null) return null;

        var oldStatus = asset.Status;
        var oldLocation = asset.Location;

        asset.Name = dto.Name.Trim();
        asset.Category = dto.Category.Trim();
        asset.Location = dto.Location.Trim();
        asset.Address = dto.Address?.Trim();
        asset.Coordinates = dto.Coordinates?.Trim();
        asset.Status = dto.Status;
        asset.OwnerId = dto.OwnerId?.Trim();
        asset.UpdatedAt = DateTime.UtcNow;

        // Track history changes
        var changes = new List<string>();
        if (oldStatus != asset.Status)
        {
            changes.Add($"Status changed from {oldStatus} to {asset.Status}");
        }
        if (!string.Equals(oldLocation, asset.Location, StringComparison.OrdinalIgnoreCase))
        {
            changes.Add($"Location changed from '{oldLocation}' to '{asset.Location}'");
        }

        var historyDesc = changes.Count > 0
            ? string.Join("; ", changes)
            : $"Asset details updated: '{asset.Name}'";

        var history = new AssetHistory
        {
            AssetId = asset.Id,
            EventType = oldStatus != asset.Status ? "StatusChanged" : "DetailsUpdated",
            Description = historyDesc,
            Date = DateTime.UtcNow,
            RecordedBy = recordedBy ?? dto.OwnerId ?? "System"
        };
        _context.AssetHistories.Add(history);

        await _context.SaveChangesAsync();

        var activeIncidentsCount = await _context.Incidents
            .CountAsync(i => i.AssetId == id &&
                             i.Status != IncidentStatus.Closed &&
                             i.Status != IncidentStatus.Resolved);

        return MapToDto(asset, activeIncidentsCount, false);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var asset = await _context.Assets.FindAsync(id);
        if (asset == null) return false;

        var hasIncidents = await _context.Incidents.AnyAsync(i => i.AssetId == id);
        if (hasIncidents)
        {
            throw new InvalidOperationException("Cannot delete an asset that has associated incidents. Decommission the asset instead.");
        }

        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<AssetHistoryDto>> GetHistoryAsync(int assetId)
    {
        var histories = await _context.AssetHistories
            .AsNoTracking()
            .Where(h => h.AssetId == assetId)
            .OrderByDescending(h => h.Date)
            .Select(h => new AssetHistoryDto
            {
                Id = h.Id,
                AssetId = h.AssetId,
                EventType = h.EventType,
                Description = h.Description,
                Date = h.Date,
                RecordedBy = h.RecordedBy
            })
            .ToListAsync();

        return histories;
    }

    public async Task<AssetHistoryDto?> AddHistoryAsync(int assetId, CreateAssetHistoryDto dto)
    {
        var assetExists = await _context.Assets.AnyAsync(a => a.Id == assetId);
        if (!assetExists) return null;

        var history = new AssetHistory
        {
            AssetId = assetId,
            EventType = dto.EventType.Trim(),
            Description = dto.Description.Trim(),
            Date = DateTime.UtcNow,
            RecordedBy = dto.RecordedBy?.Trim() ?? "System"
        };

        _context.AssetHistories.Add(history);
        await _context.SaveChangesAsync();

        return new AssetHistoryDto
        {
            Id = history.Id,
            AssetId = history.AssetId,
            EventType = history.EventType,
            Description = history.Description,
            Date = history.Date,
            RecordedBy = history.RecordedBy
        };
    }

    private static AssetDto MapToDto(Asset asset, int activeIncidentsCount, bool includeHistory)
    {
        return new AssetDto
        {
            Id = asset.Id,
            AssetCode = asset.AssetCode,
            Name = asset.Name,
            Category = asset.Category,
            Location = asset.Location,
            Address = asset.Address,
            Coordinates = asset.Coordinates,
            Status = asset.Status,
            OwnerId = asset.OwnerId,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt,
            ActiveIncidentsCount = activeIncidentsCount,
            Histories = includeHistory
                ? asset.Histories.Select(h => new AssetHistoryDto
                {
                    Id = h.Id,
                    AssetId = h.AssetId,
                    EventType = h.EventType,
                    Description = h.Description,
                    Date = h.Date,
                    RecordedBy = h.RecordedBy
                }).ToList()
                : null
        };
    }
}
