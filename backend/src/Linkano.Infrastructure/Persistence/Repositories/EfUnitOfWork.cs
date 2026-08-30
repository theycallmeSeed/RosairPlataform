using Linkano.Application.Common.Interfaces;
using Linkano.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence.Repositories;

internal sealed class EfUnitOfWork : IUnitOfWork
{
    private readonly LinkanoDbContext _context;

    public EfUnitOfWork(LinkanoDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}