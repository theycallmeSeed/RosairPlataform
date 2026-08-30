using Linkano.Application.Common.Interfaces;
using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;

namespace Linkano.Infrastructure.Persistence.Repositories;

internal sealed class EfUserRepository : EfRepository<User>, IUserRepository
{
    public EfUserRepository(LinkanoDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await Context.Set<User>()
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await Context.Set<User>()
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber, cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default)
    {
        return await Context.Set<User>()
            .AsNoTracking()
            .Where(u => u.Role == role)
            .ToListAsync(cancellationToken);
    }
}