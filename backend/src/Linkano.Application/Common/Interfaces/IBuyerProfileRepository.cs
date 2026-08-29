using Linkano.Domain.Identity;

namespace Linkano.Application.Common.Interfaces;

public interface IBuyerProfileRepository : IRepository<BuyerProfile>
{
    Task<BuyerProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}