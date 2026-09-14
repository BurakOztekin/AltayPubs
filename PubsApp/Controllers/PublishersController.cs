using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PubsApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace PubsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PublishersController : ControllerBase
    {
        private readonly PubsContext _context;

        public PublishersController(PubsContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<IEnumerable<Publisher>>> GetPublishers()
        {
            return await _context.Publishers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Publisher>> GetPublisher(string id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound("Publisher not found.");
            return publisher;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Publisher>> PostPublisher(Publisher publisher)
        {
            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPublisher), new { id = publisher.PubId }, publisher);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPublisher(string id, Publisher publisher)
        {
            if (id != publisher.PubId) return BadRequest("ID mismatch.");

            _context.Entry(publisher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PublisherExists(id)) return NotFound("Publisher to update not found.");
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(string id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound("Publisher to delete not found.");

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PublisherExists(string id)
        {
            return _context.Publishers.Any(e => e.PubId == id);
        }
    }
}