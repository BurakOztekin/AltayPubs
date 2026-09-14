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
    public class TitleAuthorsController : ControllerBase
    {
        private readonly PubsContext _context;

        public TitleAuthorsController(PubsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Titleauthor>>> GetTitleAuthors()
        {
            return await _context.Titleauthors.ToListAsync();
        }

        [HttpGet("{auId}/{titleId}")]
        public async Task<ActionResult<Titleauthor>> GetTitleAuthor(string auId, string titleId)
        {
            var titleauthor = await _context.Titleauthors.FindAsync(auId, titleId);
            if (titleauthor == null) return NotFound("Relation not found.");
            return titleauthor;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Titleauthor>> PostTitleAuthor(Titleauthor titleauthor)
        {
            _context.Titleauthors.Add(titleauthor);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TitleAuthorExists(titleauthor.AuId, titleauthor.TitleId))
                    return Conflict("This Author-Title relation already exists.");
                else throw;
            }

            return CreatedAtAction(nameof(GetTitleAuthor), new { auId = titleauthor.AuId, titleId = titleauthor.TitleId }, titleauthor);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{auId}/{titleId}")]
        public async Task<IActionResult> PutTitleAuthor(string auId, string titleId, Titleauthor titleauthor)
        {
            if (auId != titleauthor.AuId || titleId != titleauthor.TitleId) return BadRequest("ID mismatch.");

            _context.Entry(titleauthor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TitleAuthorExists(auId, titleId)) return NotFound("Relation to update not found.");
                else throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{auId}/{titleId}")]
        public async Task<IActionResult> DeleteTitleAuthor(string auId, string titleId)
        {
            var titleauthor = await _context.Titleauthors.FindAsync(auId, titleId);
            if (titleauthor == null) return NotFound("Relation to delete not found.");

            _context.Titleauthors.Remove(titleauthor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TitleAuthorExists(string auId, string titleId)
        {
            return _context.Titleauthors.Any(e => e.AuId == auId && e.TitleId == titleId);
        }
    }
}