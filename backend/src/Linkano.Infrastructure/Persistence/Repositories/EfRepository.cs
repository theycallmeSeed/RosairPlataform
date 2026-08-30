using Linkano.Application.Common.Interfaces;
using Linkano.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence.Repositories;

internal abstract class EfRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly LinkanoDbContext Context;

    protected EfRepository(LinkanoDbContext context)
    {
        Context = context;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Set<T>()
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await Context.Set<T>().AddAsync(entity, cancellationToken);
    }

    public void Remove(T entity)
    {
        Context.Set<T>().Remove(entity);
    }
}