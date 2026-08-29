namespace Linkano.Application.Identity.Dtos;

public sealed record RegisterBuyerResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt
);