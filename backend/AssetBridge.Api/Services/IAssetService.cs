using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;

namespace AssetBridge.Api.Services;

public interface IAssetService
{
    Task<IEnumerable<AssetDto>> GetAllAsync(string? search = null, string? category = null, AssetStatus? status = null);
    Task<AssetDto?> GetByIdAsync(int id, bool includeHistory = false);
    Task<AssetDto?> GetByCodeAsync(string assetCode, bool includeHistory = false);
    Task<AssetDto> CreateAsync(CreateAssetDto dto, string? recordedBy = null);
    Task<AssetDto?> UpdateAsync(int id, UpdateAssetDto dto, string? recordedBy = null);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<AssetHistoryDto>> GetHistoryAsync(int assetId);
    Task<AssetHistoryDto?> AddHistoryAsync(int assetId, CreateAssetHistoryDto dto);
}
