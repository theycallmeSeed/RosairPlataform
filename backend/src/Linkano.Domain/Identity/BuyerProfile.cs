using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class BuyerProfile : AuditableEntity
{
    private BuyerProfile(
        Guid id,
        Guid userId,
        string? companyName,
        string? taxId)
        : base(id)
    {
        UserId = userId;
        CompanyName = companyName;
        TaxId = taxId;
    }

    public Guid UserId { get; private set; }

    public string? CompanyName { get; private set; }

    public string? TaxId { get; private set; }

    public Address? DefaultShippingAddress { get; private set; }

    public static BuyerProfile Create(
        Guid userId,
        string? companyName = null,
        string? taxId = null,
        Address? defaultShippingAddress = null)
    {
        var buyerProfile = new BuyerProfile(Guid.NewGuid(), userId, companyName, taxId);

        if (defaultShippingAddress is not null)
        {
            buyerProfile.DefaultShippingAddress = defaultShippingAddress;
        }

        return buyerProfile;
    }

    public void UpdateCompanyDetails(string? companyName, string? taxId)
    {
        CompanyName = companyName;
        TaxId = taxId;
        SetUpdatedNow();
    }

    public void SetDefaultShippingAddress(Address address)
    {
        DefaultShippingAddress = address;
        SetUpdatedNow();
    }
}
