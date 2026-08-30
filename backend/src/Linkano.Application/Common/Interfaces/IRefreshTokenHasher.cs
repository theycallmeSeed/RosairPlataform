namespace Linkano.Application.Common.Interfaces;

public interface IRefreshTokenHasher
{
    string HashToken(string rawToken);
    bool VerifyToken(string hash, string rawToken);
}