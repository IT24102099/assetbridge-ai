using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly AssetBridgeDbContext _context;

        public CatalogController(AssetBridgeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CatalogItem>>> GetCatalogItems([FromQuery] string? category, [FromQuery] string? search)
        {
            var query = _context.CatalogItems.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(c => c.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.ItemName.Contains(search) || c.Description.Contains(search));
            }

            return Ok(await query.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<CatalogItem>> AddCatalogItem([FromBody] CatalogItem item)
        {
            if (string.IsNullOrEmpty(item.Id))
            {
                item.Id = $"CAT-{new Random().Next(100, 999)}";
            }

            _context.CatalogItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }
    }
}
