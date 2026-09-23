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

    public async Task<RefreshToken?> GetRefreshTokenByHashAsync(string tokenHash, CancellationToken cancellationToken = default)
    {
        return await Context.Set<RefreshToken>()
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, cancellationToken);
    }