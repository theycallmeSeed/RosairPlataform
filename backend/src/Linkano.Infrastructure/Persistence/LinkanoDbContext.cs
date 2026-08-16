using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence;

/// <summary>
/// EF Core persistence gateway for Linkano (PostgreSQL, via Npgsql). Entity sets and
/// their <c>IEntityTypeConfiguration&lt;T&gt;</c> mappings are added per module under
/// <c>Persistence/Configurations</c> (architecture.md §2) as each bounded context is
/// implemented — this foundation intentionally exposes no <c>DbSet&lt;T&gt;</c> yet.
/// </summary>
public sealed class LinkanoDbContext : DbContext
{
    public LinkanoDbContext(DbContextOptions<LinkanoDbContext> options)
        : base(options)
    {
    }
}
