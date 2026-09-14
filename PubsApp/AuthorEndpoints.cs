using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using PubsApp.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace PubsApp
{
    public static class AuthorEndpoints
    {
        public static void MapAuthorEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/Authors").RequireAuthorization();

            group.MapGet("/", async (PubsContext db) =>
            {
                return await db.Authors.ToListAsync();
            });

            group.MapGet("/{id}", async (string id, PubsContext db) =>
            {
                return await db.Authors.FindAsync(id)
                    is Author model ? Results.Ok(model) : Results.NotFound("Author not found.");
            });

            group.MapPost("/", async (Author author, PubsContext db) =>
            {
                db.Authors.Add(author);
                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    if (await db.Authors.AnyAsync(a => a.AuId == author.AuId))
                        return Results.Conflict("Author ID already exists.");
                    throw;
                }
                return Results.Created($"/api/Authors/{author.AuId}", author);
            });

            group.MapPut("/{id}", async (string id, Author author, PubsContext db) =>
            {
                if (id != author.AuId) return Results.BadRequest("ID mismatch.");

                var foundModel = await db.Authors.FindAsync(id);
                if (foundModel == null) return Results.NotFound("Author to update not found.");

                db.Entry(foundModel).CurrentValues.SetValues(author);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            group.MapDelete("/{id}", async (string id, PubsContext db) =>
            {
                var author = await db.Authors.FindAsync(id);
                if (author == null) return Results.NotFound("Author to delete not found.");

                db.Authors.Remove(author);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}