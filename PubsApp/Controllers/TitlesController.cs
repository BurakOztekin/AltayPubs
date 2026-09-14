using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PubsApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace PubsApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TitlesController : ControllerBase
    {
        private readonly PubsContext _context;

        public TitlesController(PubsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Title>>> GetTitles()
        {
            return await _context.Titles.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Title>> GetTitle(string id)
        {
            var title = await _context.Titles.FindAsync(id);
            if (title == null) return NotFound("Title not found.");
            return title;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Title>> PostTitle(Title title)
        {
            _context.Titles.Add(title);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TitleExists(title.TitleId)) return Conflict("Title ID already exists.");
                else throw;
            }

            return CreatedAtAction(nameof(GetTitle), new { id = title.TitleId }, title);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTitle(string id, Title title)
        {
            if (id != title.TitleId) return BadRequest("ID mismatch.");

            _context.Entry(title).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TitleExists(id)) return NotFound("Title to update not found.");
                else throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTitle(string id)
        {
            var title = await _context.Titles.FindAsync(id);
            if (title == null) return NotFound("Title to delete not found.");

            _context.Titles.Remove(title);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TitleExists(string id)
        {
            return _context.Titles.Any(e => e.TitleId == id);
        }
    }
}