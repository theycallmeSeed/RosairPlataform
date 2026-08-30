using Linkano.Application.Common.Interfaces;
using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence.Repositories;

internal sealed class EfBuyerProfileRepository : EfRepository<BuyerProfile>, IBuyerProfileRepository
{
    public EfBuyerProfileRepository(LinkanoDbContext context) : base(context)
    {
    }

    public async Task<BuyerProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.Set<BuyerProfile>()
            .AsNoTracking()
            .FirstOrDefaultAsync(bp => bp.UserId == userId, cancellationToken);
    }
}