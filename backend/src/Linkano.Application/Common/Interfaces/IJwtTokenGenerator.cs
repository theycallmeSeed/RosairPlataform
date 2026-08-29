using Linkano.Domain.Identity;

namespace Linkano.Application.Common.Interfaces;

public sealed record JwtTokenResult(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt
);

public interface IJwtTokenGenerator
{
    JwtTokenResult GenerateTokens(Guid userId, UserRole role);
    Guid? GetUserIdFromAccessToken(string accessToken);
    UserRole? GetRoleFromAccessToken(string accessToken);
}