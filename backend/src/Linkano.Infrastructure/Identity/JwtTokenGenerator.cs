using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Linkano.Application.Common.Interfaces;
using Linkano.Domain.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Linkano.Infrastructure.Identity;

public sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _options;

    public JwtTokenGenerator(IOptions<JwtOptions> options)
    {
        _options = options.Value;

        if (string.IsNullOrWhiteSpace(_options.Issuer))
        {
            throw new InvalidOperationException("JWT Issuer is not configured.");
        }
        if (string.IsNullOrWhiteSpace(_options.Audience))
        {
            throw new InvalidOperationException("JWT Audience is not configured.");
        }
        if (string.IsNullOrWhiteSpace(_options.SigningKey))
        {
            throw new InvalidOperationException("JWT SigningKey is not configured.");
        }
    }

    public JwtTokenResult GenerateTokens(Guid userId, UserRole role)
    {
        var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(_options.AccessTokenExpirationMinutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.Role, role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: accessTokenExpiresAt,
            signingCredentials: creds);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var refreshToken = GenerateOpaqueRefreshToken();
        var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);

        return new JwtTokenResult(
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt);
    }

    public Guid? GetUserIdFromAccessToken(string accessToken)
    {
        var handler = new JwtSecurityTokenHandler();
        if (!handler.CanReadToken(accessToken))
        {
            return null;
        }

        var jwtToken = handler.ReadJwtToken(accessToken);
        var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
        if (subClaim is null || !Guid.TryParse(subClaim.Value, out var userId))
        {
            return null;
        }

        return userId;
    }

    public UserRole? GetRoleFromAccessToken(string accessToken)
    {
        var handler = new JwtSecurityTokenHandler();
        if (!handler.CanReadToken(accessToken))
        {
            return null;
        }

        var jwtToken = handler.ReadJwtToken(accessToken);
        var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        if (roleClaim is null || !Enum.TryParse<UserRole>(roleClaim.Value, out var role))
        {
            return null;
        }

        return role;
    }

    private static string GenerateOpaqueRefreshToken()
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }
}