using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class RefreshToken : AggregateRoot
{
    private RefreshToken(
        Guid id,
        Guid userId,
        string tokenHash,
        DateTime expiresAt)
        : base(id)
    {
        UserId = userId;
        TokenHash = tokenHash;
        ExpiresAt = expiresAt;
    }

    public Guid UserId { get; private set; }

    public string TokenHash { get; private set; }

    public DateTime ExpiresAt { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public Guid? ReplacedByTokenId { get; private set; }

    public static RefreshToken Create(Guid userId, string tokenHash, DateTime expiresAt)
    {
        return new RefreshToken(Guid.NewGuid(), userId, tokenHash, expiresAt);
    }

    /// <summary>Marks this token consumed by rotation, in favor of <paramref name="replacementTokenId"/>.</summary>
    public void Rotate(Guid replacementTokenId)
    {
        RevokedAt = DateTime.UtcNow;
        ReplacedByTokenId = replacementTokenId;
        SetUpdatedNow();
    }

    /// <summary>Explicit revocation (e.g. logout, forced logout, reuse detection) — no replacement issued.</summary>
    public void Revoke()
    {
        RevokedAt = DateTime.UtcNow;
        SetUpdatedNow();
    }
}
