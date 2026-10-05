using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Services;

public interface IIncidentService
{
    Task<IEnumerable<IncidentDto>> GetAllAsync(int? assetId = null, IncidentStatus? status = null, IncidentSeverity? severity = null, string? search = null);
    Task<IncidentDto?> GetByIdAsync(int id);
    Task<IncidentDto> CreateAsync(CreateIncidentDto dto);
    Task<IncidentDto?> UpdateAsync(int id, UpdateIncidentDto dto);
    Task<IncidentDto?> UpdateStatusAsync(int id, UpdateIncidentStatusDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IncidentEvidenceDto?> AddEvidenceAsync(int incidentId, AddIncidentEvidenceDto dto);
}
