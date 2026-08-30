using Linkano.Application.Common.Interfaces;
using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence.Repositories;

internal sealed class EfRefreshTokenRepository : EfRepository<RefreshToken>, IRefreshTokenRepository
{
    public EfRefreshTokenRepository(LinkanoDbContext context) : base(context)
    {
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken = default)
    {
        return await Context.Set<RefreshToken>()
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, cancellationToken);
    }

    public async Task<IReadOnlyList<RefreshToken>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.Set<RefreshToken>()
            .AsNoTracking()
            .Where(rt => rt.UserId == userId)
            .ToListAsync(cancellationToken);
    }
}