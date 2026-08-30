using BCrypt.Net;
using Linkano.Application.Common.Interfaces;

namespace Linkano.Infrastructure.Identity;

public sealed class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.EnhancedHashPassword(password, HashType.SHA384);
    }

    public bool VerifyPassword(string passwordHash, string password)
    {
        try
        {
            return BCrypt.EnhancedVerify(password, passwordHash, HashType.SHA384);
        }
        catch
        {
            return false;
        }
    }
}