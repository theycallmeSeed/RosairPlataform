namespace Linkano.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public DateTime CreatedAt { get; protected set; }

    public DateTime? UpdatedAt { get; protected set; }

    protected AuditableEntity()
    {
        CreatedAt = DateTime.UtcNow;
    }

    protected AuditableEntity(Guid id)
        : base(id)
    {
        CreatedAt = DateTime.UtcNow;
    }

    public void SetUpdatedNow() => UpdatedAt = DateTime.UtcNow;
}
