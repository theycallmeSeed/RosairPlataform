using Linkano.Application.Common.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Linkano.Infrastructure.Identity;

public sealed class RefreshTokenHasher : IRefreshTokenHasher
{
    public string HashToken(string rawToken)
    {
        var bytes = Encoding.UTF8.GetBytes(rawToken);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }

    public bool VerifyToken(string hash, string rawToken)
    {
        var computedHash = HashToken(rawToken);
        return CryptographicOperations.FixedTimeEquals(
            Encoding.ASCII.GetBytes(computedHash),
            Encoding.ASCII.GetBytes(hash));
    }
}