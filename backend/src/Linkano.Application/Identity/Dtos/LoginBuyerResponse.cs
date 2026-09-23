namespace Linkano.Application.Identity.Dtos;

public sealed record LoginBuyerResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt
);