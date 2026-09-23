namespace Linkano.Application.Identity.Dtos;

public sealed record RefreshBuyerResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt
);