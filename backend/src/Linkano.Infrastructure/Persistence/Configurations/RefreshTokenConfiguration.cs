using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Linkano.Infrastructure.Persistence.Configurations;

/// <summary>
/// Maps <see cref="RefreshToken"/> to the <c>refresh_tokens</c> table exactly as documented
/// in domain-model.md §2.1 and database-design.md §2.1/§3/§5/§6/§8. No stored status column —
/// active/expired/revoked/rotated state is derived from <c>RevokedAt</c>/<c>ExpiresAt</c>/
/// <c>ReplacedByTokenId</c>. <c>User</c> is 1:N to <c>RefreshToken</c> via <c>UserId</c>, with
/// no navigation property on either side. No soft-delete column (database-design.md §5:
/// <c>revoked_at</c> already marks a row inactive; rows are otherwise append-only, never
/// mutated again — §6). No concurrency token (not part of the approved design).
/// </summary>
public sealed class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");

        builder.HasKey(rt => rt.Id);
        builder.Property(rt => rt.Id)
            .HasColumnName("id")
            .HasColumnType("uuid");

        builder.Property(rt => rt.UserId)
            .HasColumnName("user_id")
            .HasColumnType("uuid")
            .IsRequired();

        // Hash of the opaque refresh-token value only — the raw token is never persisted
        // (domain-model.md §2.1, mirrors User.PasswordHash).
        builder.Property(rt => rt.TokenHash)
            .HasColumnName("token_hash")
            .IsRequired();

        builder.Property(rt => rt.ExpiresAt)
            .HasColumnName("expires_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(rt => rt.RevokedAt)
            .HasColumnName("revoked_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.Property(rt => rt.ReplacedByTokenId)
            .HasColumnName("replaced_by_token_id")
            .HasColumnType("uuid")
            .IsRequired(false);

        builder.Property(rt => rt.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(rt => rt.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        // database-design.md §2.1: "token_hash unique".
        builder.HasIndex(rt => rt.TokenHash)
            .IsUnique();

        // database-design.md §8: "refresh_tokens (user_id) — revoke-all-for-user...".
        builder.HasIndex(rt => rt.UserId);

        // users 1—* refresh_tokens (database-design.md §3). No navigation on either side —
        // configured purely through the FK, same approach as BuyerProfile↔User.
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(rt => rt.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Self-referencing rotation chain — no navigation either side. Rows are never
        // hard-deleted (database-design.md §5/§6), so Restrict is effectively moot in
        // practice but is the correct, explicit choice over the convention default.
        builder.HasOne<RefreshToken>()
            .WithMany()
            .HasForeignKey(rt => rt.ReplacedByTokenId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
