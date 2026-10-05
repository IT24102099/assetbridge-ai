using Microsoft.AspNetCore.Mvc;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;

namespace AssetBridge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;
    private readonly ILogger<AssetsController> _logger;

    public AssetsController(IAssetService assetService, ILogger<AssetsController> logger)
    {
        _assetService = assetService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all assets with optional search and filtering.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AssetDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AssetDto>>> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string? category = null,
        [FromQuery] AssetStatus? status = null)
    {
        var assets = await _assetService.GetAllAsync(search, category, status);
        return Ok(assets);
    }

    /// <summary>
    /// Retrieves an asset by ID with optional history.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(AssetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AssetDto>> GetById(int id, [FromQuery] bool includeHistory = false)
    {
        var asset = await _assetService.GetByIdAsync(id, includeHistory);
        if (asset == null)
        {
            return NotFound(new { message = $"Asset with ID {id} was not found." });
        }

        return Ok(asset);
    }

    /// <summary>
    /// Retrieves an asset by its unique AssetCode.
    /// </summary>
    [HttpGet("code/{assetCode}")]
    [ProducesResponseType(typeof(AssetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AssetDto>> GetByCode(string assetCode, [FromQuery] bool includeHistory = false)
    {
        var asset = await _assetService.GetByCodeAsync(assetCode, includeHistory);
        if (asset == null)
        {
            return NotFound(new { message = $"Asset with code '{assetCode}' was not found." });
        }

        return Ok(asset);
    }

    /// <summary>
    /// Registers a new asset and logs the initial history event.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AssetDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AssetDto>> Create([FromBody] CreateAssetDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _assetService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict during asset creation: {Message}", ex.Message);
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing asset and records the update in history.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(AssetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AssetDto>> Update(int id, [FromBody] UpdateAssetDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _assetService.UpdateAsync(id, dto);
        if (updated == null)
        {
            return NotFound(new { message = $"Asset with ID {id} was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Deletes an asset (blocked if active incidents exist).
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _assetService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"Asset with ID {id} was not found." });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to delete asset ID {Id}: {Message}", id, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Retrieves the audit and lifecycle history of a specific asset.
    /// </summary>
    [HttpGet("{id:int}/history")]
    [ProducesResponseType(typeof(IEnumerable<AssetHistoryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AssetHistoryDto>>> GetHistory(int id)
    {
        var history = await _assetService.GetHistoryAsync(id);
        return Ok(history);
    }

    /// <summary>
    /// Adds a manual history event or inspection record for an asset.
    /// </summary>
    [HttpPost("{id:int}/history")]
    [ProducesResponseType(typeof(AssetHistoryDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AssetHistoryDto>> AddHistory(int id, [FromBody] CreateAssetHistoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var created = await _assetService.AddHistoryAsync(id, dto);
        if (created == null)
        {
            return NotFound(new { message = $"Asset with ID {id} was not found." });
        }

        return CreatedAtAction(nameof(GetHistory), new { id }, created);
    }
}
