using Microsoft.AspNetCore.Mvc;
using AssetBridge.Api.Dtos;
using AssetBridge.Api.Models;
using AssetBridge.Api.Services;

namespace AssetBridge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class IncidentsController : ControllerBase
{
    private readonly IIncidentService _incidentService;
    private readonly ILogger<IncidentsController> _logger;

    public IncidentsController(IIncidentService incidentService, ILogger<IncidentsController> logger)
    {
        _incidentService = incidentService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all incidents with optional filtering by asset, status, severity, or search query.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<IncidentDto>>> GetAll(
        [FromQuery] int? assetId = null,
        [FromQuery] IncidentStatus? status = null,
        [FromQuery] IncidentSeverity? severity = null,
        [FromQuery] string? search = null)
    {
        var incidents = await _incidentService.GetAllAsync(assetId, status, severity, search);
        return Ok(incidents);
    }

    /// <summary>
    /// Retrieves an incident by its ID including linked asset and evidence files.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> GetById(int id)
    {
        var incident = await _incidentService.GetByIdAsync(id);
        if (incident == null)
        {
            return NotFound(new { message = $"Incident with ID {id} was not found." });
        }

        return Ok(incident);
    }

    /// <summary>
    /// Creates a new incident, links it to an asset, verifies initial 'Reported' status, and updates asset history.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _incidentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Asset not found when creating incident: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating incident: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates details of an existing incident.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> Update(int id, [FromBody] UpdateIncidentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _incidentService.UpdateAsync(id, dto);
        if (updated == null)
        {
            return NotFound(new { message = $"Incident with ID {id} was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Updates the lifecycle status of an incident (Reported -> UnderReview -> InProgress -> Resolved -> Closed).
    /// </summary>
    [HttpPatch("{id:int}/status")]
    [HttpPut("{id:int}/status")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> UpdateStatus(int id, [FromBody] UpdateIncidentStatusDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _incidentService.UpdateStatusAsync(id, dto);
        if (updated == null)
        {
            return NotFound(new { message = $"Incident with ID {id} was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Deletes an incident.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _incidentService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Incident with ID {id} was not found." });
        }

        return NoContent();
    }

    /// <summary>
    /// Uploads/links an evidence file or photo to an incident.
    /// </summary>
    [HttpPost("{id:int}/evidence")]
    [ProducesResponseType(typeof(IncidentEvidenceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentEvidenceDto>> AddEvidence(int id, [FromBody] AddIncidentEvidenceDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var evidence = await _incidentService.AddEvidenceAsync(id, dto);
        if (evidence == null)
        {
            return NotFound(new { message = $"Incident with ID {id} was not found." });
        }

        return CreatedAtAction(nameof(GetById), new { id }, evidence);
    }
}
