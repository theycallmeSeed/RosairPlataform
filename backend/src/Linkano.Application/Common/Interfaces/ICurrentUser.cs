using Linkano.Domain.Identity;

namespace Linkano.Application.Common.Interfaces;

public interface ICurrentUser
{
    Guid? UserId { get; }
    UserRole? Role { get; }
    bool IsAuthenticated { get; }
}