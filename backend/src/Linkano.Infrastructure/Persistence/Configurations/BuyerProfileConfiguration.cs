using Linkano.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Linkano.Infrastructure.Persistence.Configurations;

/// <summary>
/// Maps <see cref="BuyerProfile"/> to the <c>buyer_profiles</c> table exactly as
/// documented in domain-model.md §2.1 and database-design.md §2.1/§3. The User↔BuyerProfile
/// relationship is 1—0..1 (database-design.md §3), enforced purely through a required,
/// unique <c>user_id</c> foreign key configured via <c>HasOne&lt;User&gt;()/WithOne()</c> —
/// no navigation property is added to either <see cref="User"/> or <see cref="BuyerProfile"/>
/// to express it. <c>DefaultShippingAddress</c> maps to a single <c>default_shipping_address
/// JSONB</c> column (database-design.md §2.1), not flattened columns, via an owned-type
/// <c>ToJson()</c> mapping. No soft-delete column and no concurrency token are configured:
/// neither is listed for <c>buyer_profiles</c> in database-design.md §5/§7, and no indexes
/// beyond the documented unique <c>user_id</c> are listed in §8.
/// </summary>
public sealed class BuyerProfileConfiguration : IEntityTypeConfiguration<BuyerProfile>
{
    public void Configure(EntityTypeBuilder<BuyerProfile> builder)
    {
        builder.ToTable("buyer_profiles");

        builder.HasKey(bp => bp.Id);
        builder.Property(bp => bp.Id)
            .HasColumnName("id")
            .HasColumnType("uuid");

        builder.Property(bp => bp.UserId)
            .HasColumnName("user_id")
            .HasColumnType("uuid")
            .IsRequired();

        builder.Property(bp => bp.CompanyName)
            .HasColumnName("company_name")
            .IsRequired(false);

        // domain-model.md §2.1: "TaxId (NUIT, nullable)".
        builder.Property(bp => bp.TaxId)
            .HasColumnName("tax_id")
            .IsRequired(false);

        // database-design.md §2.1: "default_shipping_address JSONB" — a single JSON
        // column, not one column per Address field.
        builder.OwnsOne(bp => bp.DefaultShippingAddress, address =>
        {
            address.ToJson("default_shipping_address");
        });

        builder.Property(bp => bp.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(bp => bp.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        // users 1—0..1 buyer_profiles (database-design.md §3). BuyerProfile carries the
        // FK; User has no corresponding navigation. Configured with generic type
        // arguments (no lambda to a CLR navigation) precisely because neither domain
        // entity exposes one.
        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<BuyerProfile>(bp => bp.UserId)
            .IsRequired();

        // database-design.md §2.1: "user_id FK unique".
        builder.HasIndex(bp => bp.UserId)
            .IsUnique();
    }
}
