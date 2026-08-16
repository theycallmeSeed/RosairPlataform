using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Linkano.Infrastructure.Persistence.Configurations;

/// <summary>
/// Maps <see cref="User"/> to the <c>users</c> table exactly as documented in
/// domain-model.md §2.1 and database-design.md §2.1/§1. Role and Status are stored as
/// <c>text</c> (database-design.md §1 "Enums" — no native PG enum type, no lookup table).
/// No soft-delete column and no concurrency token are configured: neither is listed for
/// <c>users</c> in database-design.md §5 (Soft Delete Strategy) or §7 (Concurrency
/// Strategy). No column max-lengths are set — database-design.md states column-level DDL
/// is intentionally out of scope for that document, and no length is documented anywhere
/// else, so none is invented here.
/// </summary>
public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .HasColumnName("id")
            .HasColumnType("uuid");

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .IsRequired();

        builder.Property(u => u.PhoneNumber)
            .HasColumnName("phone_number")
            .IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired();

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .IsRequired();

        builder.Property(u => u.FullName)
            .HasColumnName("full_name")
            .IsRequired();

        // domain-model.md §2.1: "CompanyName (nullable for Buyer individuals)".
        builder.Property(u => u.CompanyName)
            .HasColumnName("company_name")
            .IsRequired(false);

        builder.Property(u => u.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .IsRequired();

        // database-design.md §1: "Timestamps: created_at, updated_at (UTC, timestamptz)".
        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);
    }
}
